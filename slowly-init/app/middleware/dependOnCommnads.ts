
export default function depenOnCommands(_: Array<string>) {
  return async function(_: any, next?: Function) {
    // var spawn = require('child_process').spawn;
    
    // if(!Array.isArray(commnands)){

    // }
    await next();
  }
}