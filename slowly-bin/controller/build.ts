import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
import * as fs from 'fs'
import * as path from 'path'
const beautify = require("json-beautify");
var cmdify = require('cmdify');
const fse = require('fs-extra')
export default class Build extends Controller {
  @Description('build dist')
  async index() {
    const tsconfig = require(path.join(process.cwd(), 'tsconfig.json'))
    // fse.removeSync(path.join(process.cwd(), 'dist'));
    var spawn = require('child_process').spawn;
    var cmd = spawn(cmdify('npx'), ['tsc', '-d'], { cwd: process.cwd()});
    cmd.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    cmd.stderr.on('data', function (data) {
        console.log(data.toString());
    });
    cmd.on('close', () => {
      this.copyFile();
    });
  }
  async copyFile() {
    const packageJson:any = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), { encoding: 'utf8'}));
    delete packageJson.devDependencies;
    fs.writeFileSync(path.join(process.cwd(), 'dist', 'package.json'), beautify(packageJson, null, 2, 40), { encoding: 'utf8'});
    process.exit(0)
  }
}