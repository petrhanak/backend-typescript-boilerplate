import jwt from 'jsonwebtoken'
import Koa from 'koa'
import request from 'supertest'
import config from '~/common/config'
import { createServer } from '~/index'
import { authenticate } from '~/middleware/authenticate'
import { globalMiddleware } from '~/middleware/global'
import { createAccessToken } from '~/services/CryptoService'

describe('middleware > authenticate', () => {
  const app = createServer([
    globalMiddleware,
    authenticate,
    (ctx: Koa.Context) => {
      ctx.body = {
        user: ctx.state.user,
      }
    },
  ])

  it('should respond with Unauthorized for request without auth header', () => {
    return request(app.listen())
      .get('/')
      .expect(401, {
        error: { code: 'Unknown', message: 'Authentication Error' },
      })
  })

  it('should respond with Unauthorized for request with empty auth header', () => {
    return request(app.listen())
      .get('/')
      .set('Authorization', '')
      .expect(401, {
        error: { code: 'Unknown', message: 'Authentication Error' },
      })
  })

  it('should respond with Unauthorized for non-existing user', () => {
    const accessToken = createAccessToken(2578)

    return request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401, {
        error: {
          code: 'InvalidJwtPayload',
          message: 'Invalid JWT payload data',
        },
      })
  })

  it('should respond with Unauthorized for invalid jwt payload without userId', () => {
    const accessToken = jwt.sign(
      { incorrectPayload: 'foo' },
      config.auth.jwt.secret
    )

    return request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401, {
        error: {
          code: 'InvalidJwtPayload',
          message: 'Invalid JWT payload data',
        },
      })
  })

  it('should respond with Unauthorized for expired jwt token', () => {
    const accessToken = jwt.sign({ userId: 1 }, config.auth.jwt.secret, {
      expiresIn: 0,
    })

    return request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401, {
        error: { code: 'Unknown', message: 'Authentication Error' },
      })
  })

  it('should return user in body', () => {
    const accessToken = createAccessToken(1)

    return request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200, {
        user: { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      })
  })

  it('should have sanitized user data', () => {
    const accessToken = createAccessToken(1)

    return request(app.listen())
      .get('/')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).not.toHaveProperty('password')
      })
  })
})
