import joi from 'joi'
import Koa from 'koa'
import request from 'supertest'
import { createServer } from '~/index'
import { globalMiddleware } from '~/middleware/global'
import { validate } from '~/middleware/validate'

describe('middleware > validate', () => {
  it('should validate request body', () => {
    const customApp = createServer([
      globalMiddleware,
      validate(
        joi.object({
          foo: joi.number().required(),
        })
      ),
      (ctx: Koa.Context) => {
        ctx.body = 'ok'
      },
    ])

    return request(customApp.listen())
      .post('/test')
      .send({ foo: 'bar' })
      .expect(422, {
        error: {
          code: 'InvalidSchema',
          message: 'child "foo" fails because ["foo" must be a number]',
        },
      })
  })

  it('should pass validated body in state', () => {
    const customApp = createServer([
      globalMiddleware,
      validate(
        joi.object({
          timestamp: joi.date().required(),
        })
      ),
      (ctx: Koa.Context) => {
        ctx.body = ctx.state.validatedBody
      },
    ])

    return request(customApp.listen())
      .post('/')
      .send({ timestamp: 1521310885000 })
      .expect(200, {
        timestamp: '2018-03-17T18:21:25.000Z',
      })
  })
})
