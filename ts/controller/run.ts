import { Controller } from 'slowly'
import { Option, Description, Before} from 'slowly/decorator'
export default class InitController extends Controller {
  @Description('init')
  @Option('<command>', 'dependencies')
  @Option('-q --query <query>', 'save dev')
  async index() {
    console.log(1111)
    console.log(this.ctx.query)
  }
}