#!/usr/bin/env node

import { App } from 'slowly'
const app = new App({
  version: '1.0.0',
  name: 'my-git'
});
const { router } = app;
router.register('init','this is git init', app.ctx.controller.init)
  .option('-n, --name', 'name')
  .alias('i')
app.start();
