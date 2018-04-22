import Boom from 'boom'
import { ZXCVBNResult } from 'zxcvbn'

export enum ErrorCodes {
  UNKNOWN = 'Unknown',
  INVALID_SCHEMA = 'InvalidSchema',
  INVALID_JSON_BODY = 'InvalidJsonBody',
  WEAK_PASSWORD = 'WeakPassword',
  DUPLICATE_EMAIL = 'DuplicateEmail',
  INVALID_CREDENTIALS = 'InvalidCredentials',
  INVALID_JWT_PAYLOAD = 'InvalidJwtPayload',
}

export const validationError = (message: any): Boom =>
  Boom.badData(message, {
    code: ErrorCodes.INVALID_SCHEMA,
  })

export const invalidJsonBodyError = (): Boom =>
  Boom.badRequest('Request JSON body is not valid', {
    code: ErrorCodes.INVALID_JSON_BODY,
  })

export const weakPasswordError = (result: ZXCVBNResult): Boom =>
  Boom.badData(result.feedback.warning, {
    code: ErrorCodes.WEAK_PASSWORD,
    score: result.score,
  })

export const duplicateEmail = (): Boom =>
  Boom.conflict('Email is already registered', {
    code: ErrorCodes.DUPLICATE_EMAIL,
  })

export const invalidCredentials = (): Boom =>
  Boom.unauthorized('Login credentials are incorrect', 'Bearer', {
    code: ErrorCodes.INVALID_CREDENTIALS,
  })

export const invalidJwtPayload = (): Boom =>
  Boom.unauthorized('Invalid JWT payload data', 'Bearer', {
    code: ErrorCodes.INVALID_JWT_PAYLOAD,
  })
