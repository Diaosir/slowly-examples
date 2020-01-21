import * as inquirer from 'inquirer'
export default function inquire(questions?: any) {
  return async function(ctx: any, next?: Function) {
    const data = await inquirer.prompt(questions);
    ctx.query = {
      ...ctx.query,
      ...data
    }
    if(typeof next === 'function') {
      await next();
    } else {
      return data;
    }
  }
}