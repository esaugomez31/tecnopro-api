import { v4 as uuidv4 } from 'uuid'
import { Like } from 'typeorm'
import { UserModel } from '../models'
import { logger, hashPassword, comparePassword, getLocalDateTimeNow } from '../helpers'
import { iFilterSettings } from '../interfaces/filter.interfaces'
import {
  iUserPublicResponse,
  iUserFilters,
  iUserQueryParams,
  iGetUsersResponse,
  iGetUserByIdResponse
} from '../interfaces/user.interfaces'
import {
  InvalidUserCredentialsError,
  UsernameExistsError,
  UserNotFoundError,
  EmailExistsError
} from '../errors/user.error'

const publicSelect: Array<keyof UserModel> = [
  'idUser',
  'uuid',
  'name',
  'username',
  'email',
  'phoneNumber',
  'whatsappNumber',
  'owner',
  'notifications',
  'status',
  'lastLogin',
  'timeZone',
  'idRol'
]

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
    logger.error('Login user error: ' + (error as Error).name)
    throw error
  }
}

export const userCreate = async (user: UserModel): Promise<UserModel> => {
  try {
    // Searching for username or email matches
    await userOrEmailExist(user.username, user.email)
    // Generate UUID
    user.uuid = uuidv4()
    // Hash password
    user.password = hashPassword(user.password)

    // Create user
    const createdUser = await UserModel.save(user)
    return createdUser
  } catch (error) {
    logger.error('Create user error: ' + (error as Error).name)
    throw error
  }
}

export const userUpdate = async (user: UserModel, idUser: number): Promise<UserModel> => {
  try {
    // Searching for username or email matches
    await userOrEmailExist(user.username, user.email, idUser)

    // Hash password
    if (user.password !== undefined) {
      user.password = hashPassword(user.password)
    }

    // update user
    const updatedUser = await UserModel.save({
      idUser, ...user
    })
    return updatedUser
  } catch (error) {
    logger.error('Update user error: ' + (error as Error).name)
    throw error
  }
}

export const userGetAll = async (filterParams: iUserFilters, settings: iFilterSettings): Promise<iGetUsersResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [users, totalCount] = await Promise.all([
      UserModel.find({
        select: publicSelect,
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      UserModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: users,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get users error: ' + (error as Error).name)
    throw error
  }
}

export const userGetbyId = async (idUser: number): Promise<iGetUserByIdResponse> => {
  try {
    const user = await UserModel.findOne({
      where: { idUser, status: true }
    })
    return { data: user ?? {} }
  } catch (error) {
    logger.error('Get user by id error: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iUserFilters): iUserQueryParams => {
  const filters: iUserQueryParams = {}
  const { username, name, email, idRol, phoneNumber, status } = filterParams

  if (username !== undefined) {
    filters.username = Like(`%${username}%`)
  }

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (email !== undefined) {
    filters.email = Like(`%${email}%`)
  }

  if (phoneNumber !== undefined) {
    filters.phoneNumber = Like(`%${phoneNumber}%`)
  }

  if (status !== undefined) {
    filters.status = status
  }

  if (idRol !== undefined) {
    filters.idRol = idRol
  }

  return filters
}

const userOrEmailExist = async (username: string | undefined, email: string | undefined, idUser: number | undefined = undefined): Promise<void> => {
  if (username === undefined && email === undefined) return

  const filters: iUserQueryParams[] = []

  if (username !== undefined) {
    filters.push({ username })
  }

  if (email !== undefined) {
    filters.push({ email })
  }

  const existUser = await UserModel.findOne({
    select: ['idUser', 'email', 'username'],
    where: filters
  })

  if (existUser !== null) {
    // Searching for username matches
    if (existUser.username === username && existUser.idUser !== idUser) {
      throw new UsernameExistsError()
    }
    // Searching for email matches
    if (existUser.email === email && existUser.idUser !== idUser) {
      throw new EmailExistsError()
    }
  }
}
