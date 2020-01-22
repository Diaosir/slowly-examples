import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
var readline = require('readline');
var cmdify = require('cmdify');

export default class Start extends Controller {
  @Description('slowly start')
  async index() {
    var rl = readline.createInterface(process.stdin, process.stdout);
    rl.setPrompt(`slowly> `);
    rl.prompt();
    var spawn = require('child_process').spawn;
    
    rl.on('line', function(line) {
      const args = line.trim().split(/\s+/);
      var cmd = spawn(cmdify('npx'), ['ts-node', './index.ts'].concat(args), { cwd: process.cwd()});
      cmd.stdout.on('data', function (data) {
          console.log(data.toString());
      });
      cmd.stderr.on('data', function (data) {
          console.log(data.toString());
      });
      cmd.on('close', () => {
        rl.prompt();
      });
	    // switch(line.trim()) {
      //   case 'copy':
      //       console.log("复制");
      //       break;
      //   case 'hello':
      //       console.log('world!');
      //       break;
      //   case 'close':
      //       rl.close();
      //       break;
      //   default:
      //       console.log('没有找到命令！');
      //       break;
      // }
      
    });
    rl.on('close', function() {
        console.log('bye bye!');
        process.exit(0);
    });
  }
}