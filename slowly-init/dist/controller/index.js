var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const slowly_1 = require("slowly");
const decorator_1 = require("slowly/decorator");
const inquirer_1 = require("../middleware/inquirer");
const dependOnCommnads_1 = require("../middleware/dependOnCommnads");
var BottomBar = require('inquirer/lib/ui/bottom-bar');
class InitController extends slowly_1.Controller {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const { service: { github }, query: { name } } = this.ctx;
            var loader = ['/ Installing', '| Installing', '\\ Installing', '- Installing'];
            var i = 4;
            var ui = new BottomBar({ bottomBar: loader[i % 4] });
            ui.updateBottomBar(loader[i++ % 4]);
            setInterval(() => {
                ui.updateBottomBar(loader[i++ % 4]);
            }, 300);
            yield github.getTemplate(name, 'ts');
            ui.updateBottomBar(`Installation done!\ncd ${name} & npm install & npm start`);
            process.exit();
        });
    }
}
__decorate([
    decorator_1.Description('1111'),
    decorator_1.Option('-t, --typescript', 'is typescript'),
    decorator_1.Before([dependOnCommnads_1.default(['tsc']), inquirer_1.default([
            {
                type: 'input',
                message: 'input your commander name',
                name: 'name',
                required: true
            }
        ])])
], InitController.prototype, "index", null);
exports.default = InitController;
