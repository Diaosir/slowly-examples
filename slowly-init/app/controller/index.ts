import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
import inquirer from '../middleware/inquirer'
import dependOnCommands from '../middleware/dependOnCommnads'
var BottomBar = require('inquirer/lib/ui/bottom-bar');
export default class InitController extends Controller {
  @Description('1111')
  @Option('-t, --typescript', 'is typescript')
  @Before([dependOnCommands(['tsc']),inquirer([
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
    await github.getTemplate(name, 'ts');
    ui.updateBottomBar(`Installation done!\ncd ${name} & npm install & npm start`);
    process.exit();
  }
}
