import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
var cmdify = require('cmdify');
export default class Build extends Controller {
  // @Description('publish')
  async index() {
    var spawn = require('child_process').spawn;
    var cmd = spawn(cmdify('npx'), ['typescript', '-d', '-w', 'false'], { cwd: process.cwd()});
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