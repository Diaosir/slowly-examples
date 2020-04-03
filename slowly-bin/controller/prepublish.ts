import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
var cmdify = require('cmdify');
export default class PrePublish extends Controller {
  // @Description('prepublish')
  async index() {
    var spawn = require('child_process').spawn;
    console.log(process.cwd())
    var cmd = spawn(cmdify('npx'), ['typescript', '-d'], { cwd: process.cwd()});
    cmd.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    cmd.stderr.on('data', function (data) {
        console.log(data.toString());
    });
    cmd.on('close', () => {
      process.exit(0)
    });
  }
}