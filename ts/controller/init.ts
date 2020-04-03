import { Controller } from 'slowly'
import { Option, Description, Before} from 'slowly/decorator'
export default class InitController extends Controller {
  @Description('init')
  @Option('[packages...]', 'dependencies')
  @Option('-d --dev [dev]', 'save dev')
  async index() {
    console.log(1111)
    console.log(this.ctx.query)
  }
  @Description('init test')
  async test() {

  }
}