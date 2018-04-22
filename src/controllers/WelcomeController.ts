import Koa from 'koa'

export const welcomeController = (ctx: Koa.Context) => {
  ctx.body = 'projectx API 🤖'
}
