import { toLower } from 'ramda'
import { duplicateEmail } from '~/common/errors'
import { User } from '~/database/sql/models'
import {
  checkPasswordStrength,
  generateUserResponse,
  hashPassword,
  validateUser,
} from '~/services/CryptoService'

const checkEmailDuplicity = async (email: string) => {
  const user = await User.query().findOne({ email })

  if (user) {
    throw duplicateEmail()
  }
}

export const createUser = async ({
  email,
  name,
  password,
}: {
  name: string
  email: string
  password: string
}) => {
  const lowerEmail = toLower(email)
  checkPasswordStrength(password)
  await checkEmailDuplicity(lowerEmail)

  const passwordHash = await hashPassword(password)

  const user = await User.query().insert({
    email: lowerEmail,
    name,
    password: passwordHash,
  })

  return generateUserResponse(user)
}

export const authenticateUser = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const lowerEmail = toLower(email)

  const user = await User.query().findOne({ email: lowerEmail })

  await validateUser(user, password)

  return generateUserResponse(user!)
}
