import { Service } from 'slowly'
import Memfs from '../utils/memfs'
const fse = require('fs-extra')
const outputFileSync = require('output-file-sync');
import * as path from 'path'
import { URI } from '../utils/uri'
const glob = require('glob');
const downloadUrl = require('download');

export default class GithubService extends Service {
  public localFileSystem: Memfs = new Memfs();
  private _gitDest = 'template-dist';
  private _gitUrl = 'https://github.com/Diaosir/slowly/archive/master.zip'
  async downloadGitRepo(template: string) {
    await new Promise((resolve, reject) => {
      downloadUrl(this._gitUrl, this._gitDest, {
        extract: true,
        strip: 1,
        headers: {
          accept: 'application/zip'
        }
      })
      .then(async () => {
        const list = glob.sync(`${this._gitDest}/**/*`, { dot: true });
        await Promise.all(list.map( async (filename) => {
          const stat = fse.statSync(filename);
          const uri = URI.parse(`loaclFs:${filename.replace(this._gitDest, '')}`);
          if(stat.isDirectory()) {
            await this.localFileSystem.mkdir(uri);
          } else {
            await this.localFileSystem.writeFileAnyway(uri, fse.readFileSync(filename, { encoding: 'utf-8'}));
          }
        }))
        fse.removeSync(this._gitDest);
        resolve('success')
      })
      .catch((err) => {
        reject(err)
      })
    })
  }
  async getTemplate(dest, template) {
    await this.downloadGitRepo(template);
    const stat: any = await this.localFileSystem.stat(URI.parse(`loaclFs:${template}`));
    this._createFileToLocalFileSystem(dest, stat)
  }
  private async _createFileToLocalFileSystem(dest: string, entry: any) {
    fse.removeSync(dest);
    this.localFileSystem.walk(entry, async (file, filename, isDirecttory) => {
      if(isDirecttory) {
        return;
      }
      outputFileSync(path.join(dest, filename), file.data, 'utf-8');
    })
  }
}