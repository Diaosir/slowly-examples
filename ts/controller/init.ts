import { Controller } from 'slowly'
import { Option, Description, Before } from 'slowly/decorator'
export default class InitController extends Controller {
  @Description('init')
  async index() {
    console.log(1111)
  }
}