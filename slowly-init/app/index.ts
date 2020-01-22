#!/usr/bin/env node

import { App } from 'slowly'
import decorator from 'slowly/decorator'
const chalk = require('chalk')
const app = new App({
  version: '1.0.0',
  name: 'slowly-init'
});
app.ctx.log = (...args) => {
  args[0] = `[${chalk.blue(app.name)}] ` + args[0];
  console.log.apply(console, args);
}
app.use(decorator())
app.start();
