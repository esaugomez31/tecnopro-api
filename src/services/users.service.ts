import { v4 as uuidv4 } from 'uuid'
import { logger, hashPassword, comparePassword, getLocalDateTimeNow } from '../helpers'
import { iUserPublicResponse } from '../interfaces/user.interfaces'
import { UserModel } from '../models'
import {
  InvalidUserCredentialsError,
  UsernameExistsError,
  UserNotFoundError,
  EmailExistsError
} from '../errors/user.error'

export const userLogin = async (usernameOrEmail: string, password: string): Promise<iUserPublicResponse> => {
  try {
    // Searching for credential matches
    const user = await UserModel.findOne({
      where: [
        { username: usernameOrEmail, status: true },
        { email: usernameOrEmail, status: true }
      ]
    })

    if (user === null) {
      throw new UserNotFoundError()
    }
    // comparing encrypted password with bcrypt
    if (!comparePassword(password, user.password)) {
      throw new InvalidUserCredentialsError()
    }

    // Update last login datetime
    user.last_login = new Date(getLocalDateTimeNow())
    await UserModel.save(user)

    return {
      id_user: user.id_user,
      uuid: user.uuid,
      name: user.name,
      username: user.username,
      phone_number: user.phone_number,
      whatsapp_number: user.whatsapp_number,
      email: user.email,
      owner: user.owner,
      notifications: user.notifications,
      last_login: user.last_login,
      time_zone: user.time_zone,
      id_rol: user.id_rol,
      access_token: null
    }
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
    // Hash password
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
      id_rol: user.id_rol ?? null
    }

    // Create user
    const createdUser = await UserModel.save(newUser)
    return createdUser
  } catch (error) {
    logger.error('Create user error:', error)
    throw error
  }
}
