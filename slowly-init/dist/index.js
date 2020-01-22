#!/usr/bin/env node
Object.defineProperty(exports, "__esModule", { value: true });
const slowly_1 = require("slowly");
const decorator_1 = require("slowly/decorator");
const chalk = require('chalk');
const app = new slowly_1.App({
    version: '1.0.0',
    name: 'slowly-init'
});
app.ctx.log = (...args) => {
    args[0] = `[${chalk.blue(app.name)}] ` + args[0];
    console.log.apply(console, args);
};
app.use(decorator_1.default());
app.start();
