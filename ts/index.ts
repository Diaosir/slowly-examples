#!/usr/bin/env node

import { App } from 'slowly'
import decorator from 'slowly/decorator'
const app = new App({
  version: '1.0.0',
  name: 'test'
});
app.use(decorator())
app.start();