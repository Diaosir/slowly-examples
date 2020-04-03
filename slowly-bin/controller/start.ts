import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
var readline = require('readline');
var cmdify = require('cmdify');
import * as path from 'path'
export default class Start extends Controller {
  @Description('slowly start')
  @Option('[source]', 'entry file')
  async index() {
    const { query } = this.ctx
    var rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt(`slowly> `);
    rl.prompt();
    var spawn = require('child_process').spawn;
    rl.on('line', function(line) {
      if(line.trim() === 'close') {
        rl.close();
        return;
      }
      const args = line.trim().split(/\s+/);
      var cmd = spawn(cmdify('node'), [path.resolve(__filename, '../../utils/ts-node.js'), query.source || './index.ts'].concat(args), {
         cwd: process.cwd(),
         stdio: [process.stdin, process.stdout, process.stderr]
      });
      cmd.on('close', () => {
        rl.prompt();
      });
    });
    rl.on('close', function() {
        console.log('bye bye!');
        process.exit(0);
    });
  }
}