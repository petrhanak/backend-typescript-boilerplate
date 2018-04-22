import Boom from 'boom'
import { Context } from 'koa'
import bodyParser from 'koa-bodyparser'
import compose from 'koa-compose'
import { omit } from 'ramda'
import { ErrorCodes, invalidJsonBodyError } from '~/common/errors'

const createResponse = (
  message: string,
  { code = ErrorCodes.UNKNOWN, ...details }: { code?: string } = {}
) => ({
  error: {
    ...details,
    code,
    message,
  },
})

const getErrorData = (error: Boom): object =>
  // basic error
  error.data ||
  // unauthorized error
  omit(['error'], error.output.payload.attributes)

export const errorMiddleware = (ctx: Context, next: () => Promise<any>) => {
  return next().then(
    () => {
      ctx.status = ctx.response.status
      if (!ctx.body) {
        ctx.body = createResponse(ctx.response.message)
      }
    },
    err => {
      const error = Boom.boomify(err, {
        statusCode: err.status,
      })
      const data = getErrorData(error)

      ctx.status = error.output.statusCode
      ctx.body = createResponse(error.message, data)
    }
  )
}

export const bodyParserMiddleware = bodyParser({
  onerror: () => {
    throw invalidJsonBodyError()
  },
})

export const globalMiddleware = compose([errorMiddleware, bodyParserMiddleware])
