import { logger, hashPassword } from '../helpers'
import { UserModel } from '../models'
import {
  InvalidUserCredentialsError
} from '../errors/user.error'

export const userLogin = async (username: string, password: string): Promise<UserModel | Error> => {
  try {
    // Hash password to sha256
    const hashedPassword = hashPassword(password)
    // Searching for credential matches
    const user = await UserModel.findOne({ where: { username, password: hashedPassword } })
    if (user === null) {
      throw new InvalidUserCredentialsError()
    }

    return user
  } catch (error) {
    logger.error(error)
    throw error
  }
}
