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
  private _gitUrl = 'https://github.com/Diaosir/slowly-examples/archive/master.zip'
  async downloadGitRepo() {
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
          const relativeName = filename.replace(this._gitDest, '');
          const uri = URI.parse(`loaclFs:${relativeName}`);
          if(!stat.isDirectory()) {
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
    await this.downloadGitRepo();
    const stat: any = await this.localFileSystem.stat(URI.parse(`loaclFs:${template}`));
    fse.removeSync(dest);
    this.localFileSystem.walk(stat, async (file, filename, isDirecttory) => {
      if(isDirecttory) {
        return;
      }
      outputFileSync(path.join(dest, filename.replace(new RegExp(`^${template}`), '')), file.data, 'utf-8');
    })
  }
}