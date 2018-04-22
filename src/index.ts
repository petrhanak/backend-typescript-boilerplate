import './init'

import ip from 'ip'
import Koa from 'koa'
import compose from 'koa-compose'
import config from '~/common/config'
import { globalMiddleware } from '~/middleware/global'
import { routerMiddleware } from '~/router'

export const createServer = (middlewares: Koa.Middleware[]) =>
  new Koa().use(compose(middlewares))

const app = createServer([globalMiddleware, routerMiddleware])

export const startApp = (): Promise<any> =>
  new Promise(resolve => {
    const httpServer = app.listen(config.server.port, () => {
      const address = `${ip.address()}:${httpServer.address().port}`
      console.info(`Server running on ${address}`) // tslint:disable-line:no-console

      resolve()
    })
  })

/* istanbul ignore next */
if (!module.parent) {
  startApp()
}

export default app
