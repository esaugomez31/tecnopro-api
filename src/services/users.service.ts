import { v4 as uuidv4 } from 'uuid'
import { Like } from 'typeorm'
import { logger, hashPassword, comparePassword, getLocalDateTimeNow } from '../helpers'
import { iUserPublicResponse, iUserFilterParams, iUserQueryParams } from '../interfaces/user.interfaces'
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
    user.lastLogin = new Date(getLocalDateTimeNow())
    await UserModel.save(user)

    return {
      idUser: user.idUser,
      uuid: user.uuid,
      name: user.name,
      username: user.username,
      phoneNumber: user.phoneNumber,
      whatsappNumber: user.whatsappNumber,
      email: user.email,
      owner: user.owner,
      notifications: user.notifications,
      lastLogin: user.lastLogin,
      timeZone: user.timeZone,
      idRol: user.idRol,
      accessToken: null
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
      phoneNumber: user.phoneNumber ?? null,
      whatsappNumber: user.whatsappNumber ?? null,
      email: user.email,
      notifications: user.notifications !== undefined ? Boolean(user.notifications) : false,
      lastLogin: null,
      idRol: user.idRol ?? null
    }

    // Create user
    const createdUser = await UserModel.save(newUser)
    return createdUser
  } catch (error) {
    logger.error('Create user error:', error)
    throw error
  }
}

export const userGetAll = async (filterParams: iUserFilterParams): Promise<UserModel[] | Error> => {
  try {
    const filters: iUserQueryParams = {}
    const { limit, page, username, name, email, idRol } = filterParams

    if (username !== undefined) {
      filters.username = Like(`%${username}%`)
    }

    if (name !== undefined) {
      filters.name = Like(`%${name}%`)
    }

    if (email !== undefined) {
      filters.email = Like(`%${email}%`)
    }

    if (idRol !== undefined) {
      filters.idRol = idRol
    }

    // Pagination settings
    const validPage = page > 0 ? page : 1
    const skip = (validPage - 1) * limit

    const users = await UserModel.find({ where: filters, take: limit, skip })

    return users
  } catch (error) {
    logger.error('Get users error:', error)
    throw error
  }
}
