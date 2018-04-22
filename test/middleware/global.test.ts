import Koa from 'koa'
import request from 'supertest'
import { createServer } from '~/index'
import { bodyParserMiddleware, errorMiddleware } from '~/middleware/global'

describe('middleware > global', () => {
  it('should handle ok status', () => {
    const customApp = createServer([
      errorMiddleware,
      (ctx: Koa.Context) => {
        ctx.body = {
          foo: 'bar',
        }
      },
    ])

    return request(customApp.listen())
      .get('/')
      .expect(200, {
        foo: 'bar',
      })
  })

  it('should handle non-error status', () => {
    const customApp = createServer([errorMiddleware])

    return request(customApp.listen())
      .get('/')
      .expect(404, {
        error: { code: 'Unknown', message: 'Not Found' },
      })
  })

  it('should handle internal server error', () => {
    const customApp = createServer([
      errorMiddleware,
      () => {
        throw new Error()
      },
    ])

    return request(customApp.listen())
      .get('/')
      .expect(500, {
        error: { code: 'Unknown', message: 'Internal Server Error' },
      })
  })

  it('should parse json request', () => {
    const customApp = createServer([
      bodyParserMiddleware,
      (ctx: Koa.Context) => {
        expect(ctx.request.body).toMatchObject({ foo: 'bar' })
        ctx.body = 'ok'
      },
    ])

    return request(customApp.listen())
      .post('/')
      .send({ foo: 'bar' })
      .expect(200, 'ok')
  })

  it('should handle malformed json body', () => {
    const customApp = createServer([
      errorMiddleware,
      bodyParserMiddleware,
      (ctx: Koa.Context) => {
        ctx.body = 'ok'
      },
    ])

    return request(customApp.listen())
      .post('/')
      .set('Content-Type', 'application/json')
      .send('{ invalid JSON body " : }')
      .expect(400, {
        error: {
          code: 'InvalidJsonBody',
          message: 'Request JSON body is not valid',
        },
      })
  })
})
