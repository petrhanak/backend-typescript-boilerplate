import { Context } from 'koa'
import compose from 'koa-compose'
import jwt from 'koa-jwt'
import config from '~/common/config'
import { invalidJwtPayload } from '~/common/errors'
import { User } from '~/database/sql/models'
import { sanitizeUser, validateJwtPayload } from '~/services/CryptoService'

export const authenticate = compose([
  jwt({ secret: config.auth.jwt.secret, key: 'jwtData' }),
  async (ctx: Context, next: () => Promise<any>) => {
    const data = ctx.state.jwtData

    validateJwtPayload(data)

    const user = await User.query().findById(data.userId)

    if (!user) {
      throw invalidJwtPayload()
    }

    ctx.state.user = sanitizeUser(user)

    return next()
  },
])
