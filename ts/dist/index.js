#!/usr/bin/env node
Object.defineProperty(exports, "__esModule", { value: true });
const slowly_1 = require("slowly");
const path = require("path");
const app = new slowly_1.App({
    version: '1.0.0',
    name: 'my-git',
    userConfigFile: path.join(process.cwd(), 'auto-build-api.config.js')
});
const { router } = app;
router.register('init', 'this is git init', app.ctx.controller.init)
    .option('-n, --name', 'name');
app.start();
