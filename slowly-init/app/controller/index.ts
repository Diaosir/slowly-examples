import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
import inquirer from '../middleware/inquirer'
var BottomBar = require('inquirer/lib/ui/bottom-bar');
var cmdify = require('cmdify');
export default class InitController extends Controller {
  @Description('1111')
  @Option('-t, --typescript', 'is typescript')
  @Before([inquirer([
   {
        type: 'input',
        message: 'input your commander name',
        name: 'name',
        required: true
      }
  ])])
  async index() {
    const { service: { github }, query: { name }} = this.ctx;
    var loader = ['/ Installing', '| Installing', '\\ Installing', '- Installing'];
    var i = 4;
    var ui = new BottomBar({ bottomBar: loader[i % 4] });
    ui.updateBottomBar(loader[i++ % 4]);
    setInterval(() => {
      ui.updateBottomBar(loader[i++ % 4]);
    }, 300);
    await github.getTemplate(name,'lib');

    var spawn = require('child_process').spawn;
    var cmd = spawn(cmdify('npm'), ['install'], { stdio: 'pipe', });
    cmd.stdout.pipe(ui.log);
    cmd.on('close', () => {
      ui.updateBottomBar('Installation done!\n');
      process.exit();
    });
  }
}
