import joi from 'joi'
import { Context } from 'koa'
import { validationError } from '~/common/errors'

export const validate = (schema: any) => (
  ctx: Context,
  next: () => Promise<any>
) => {
  const validationResult = joi.validate(ctx.request.body, schema)

  if (validationResult.error) {
    throw validationError(validationResult.error.message)
  }

  ctx.state.validatedBody = validationResult.value

  return next()
}
