import { v4 as uuidv4 } from 'uuid'
import { logger, hashPassword } from '../helpers'
import { UserModel } from '../models'
import {
  InvalidUserCredentialsError,
  UsernameExistsError,
  EmailExistsError
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

export const userCreate = async (user: any): Promise<UserModel | Error> => {
  try {
    // Searching for username or email matches
    const existUser = await UserModel.findOne({
      where: [
        { username: user.username },
        { email: user.email }
      ]
    })

    if (existUser !== null) {
      // Searching for username matches
      if (existUser.username === user.username) {
        throw new UsernameExistsError()
      }
      // Searching for email matches
      if (existUser.email === user.email) {
        throw new EmailExistsError()
      }
    }
    // Hash password to sha256
    const hashedPassword = hashPassword(user.password)
    // Generate UUID
    const generatedUuid: string = uuidv4()
    // Create a user object with all required properties
    const newUser = {
      uuid: generatedUuid,
      name: user.name,
      username: user.username,
      password: hashedPassword,
      phone_number: user.phone_number ?? null,
      whatsapp_number: user.whatsapp_number ?? null,
      email: user.email,
      notifications: user.notifications !== undefined ? Boolean(user.notifications) : false,
      last_login: null,
      id_rol: Number(user.id_rol) ?? null
    }

    // Create user
    const createdUser = await UserModel.create(newUser)
    return createdUser
  } catch (error) {
    logger.error('Create user error:', error)
    throw error
  }
}
