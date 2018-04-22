import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { omit, propIs } from 'ramda'
import zxcvbn from 'zxcvbn'
import config from '~/common/config'
import {
  invalidCredentials,
  invalidJwtPayload,
  weakPasswordError,
} from '~/common/errors'
import { User } from '~/database/sql/models'

export interface IAccessTokenPayload {
  userId: number
}

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, config.auth.password.cryptoRounds)

export const checkPasswordStrength = (password: string) => {
  const truncatedPassword = password.slice(
    0,
    config.auth.password.effectiveLength
  )
  const passwordSecurity = zxcvbn(truncatedPassword)

  if (passwordSecurity.score <= 2) {
    throw weakPasswordError(passwordSecurity)
  }
}

export const createAccessToken = (userId: number) =>
  jwt.sign({ userId }, config.auth.jwt.secret, {
    expiresIn: config.auth.jwt.expiresIn,
  })

export const verifyAccessToken = (accessToken: string): IAccessTokenPayload =>
  jwt.verify(accessToken, config.auth.jwt.secret) as IAccessTokenPayload

export const validateJwtPayload = (payload: object) => {
  if (!propIs(Number, 'userId', payload)) {
    throw invalidJwtPayload()
  }
}

export const sanitizeUser = (user: User) => omit(['password'], user)

export const validateUser = async (
  user: User | undefined,
  password: string
) => {
  if (!user) {
    throw invalidCredentials()
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw invalidCredentials()
  }
}

export const generateUserResponse = async (user: User) => {
  const accessToken = await createAccessToken(user.id)
  const sanitizedUser = sanitizeUser(user)

  return {
    accessToken,
    user: sanitizedUser,
  }
}
