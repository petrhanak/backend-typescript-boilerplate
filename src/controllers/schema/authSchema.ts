import joi from 'joi'

export const signupSchema = joi.object().keys({
  email: joi
    .string()
    .email()
    .required(),
  name: joi.string().required(),
  password: joi.string().required(),
})

export const loginSchema = joi.object().keys({
  email: joi
    .string()
    .email()
    .required(),
  password: joi.string().required(),
})
