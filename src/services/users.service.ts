import { v4 as uuidv4 } from 'uuid'
import envs from '../config/environment.config'
import { UserModel } from '../models'
import { roleGetById } from '.'
import {
  logger,
  hashPassword,
  applyFilter
} from '../helpers'
import {
  IFilterSettings,
  IUserFilters,
  IUserQueryParams,
  IGetUsersResponse,
  IGetUniqueUser,
  UserRoleEnum,
  IUserJWT,
  IUser
} from '../interfaces'
import {
  UserActionNotAllowedError,
  UsernameExistsError,
  UserIDNotFoundError,
  EmailExistsError
} from '../errors/user.error'
import {
  IDRoleNotFoundError
} from '../errors/role.error'

const publicSelect: Array<keyof UserModel> = [
  'idUser',
  'uuid',
  'name',
  'username',
  'email',
  'phoneNumber',
  'whatsappNumber',
  'type',
  'notifications',
  'status',
  'lastLogin',
  'timeZone',
  'idRole'
]

export const userSignup = async (user: IUser): Promise<IUser> => {
  try {
    // Searching for username or email matches
    await userRequitedValidations(user.username, user.email, user.idRole)
    // Generate UUID
    user.uuid = uuidv4()
    // Hash password
    user.password = hashPassword(user.password)

    // Signup user
    const newUser = await UserModel.save({ ...user })
    return newUser
  } catch (error) {
    logger.error('Signup user: ' + (error as Error).name)
    throw error
  }
}

export const userUpdate = async (user: IUser, idUser: number, jwtData: IUserJWT): Promise<IUser> => {
  try {
    // Evaluate hierarchy
    if (jwtData.type !== UserRoleEnum.ADMIN) await evaluateUserHierarchy(jwtData, idUser)

    // Searching for username or email matches
    await userRequitedValidations(user.username, user.email, user.idRole, idUser)

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
    logger.error('Update user: ' + (error as Error).name)
    throw error
  }
}

export const userUpdateLastLogin = async (idUser: number, lastLogin: Date): Promise<IUser> => {
  try {
    // update user last login
    const updatedUser = await UserModel.save({
      idUser, lastLogin
    })
    return updatedUser
  } catch (error) {
    logger.error('Update user last status: ' + (error as Error).name)
    throw error
  }
}

export const userUpdateStatus = async (idUser: number, status: boolean, jwtData: IUserJWT): Promise<IUser> => {
  try {
    // Evaluate hierarchy
    if (jwtData.type !== UserRoleEnum.ADMIN) await evaluateUserHierarchy(jwtData, idUser)

    // update user status
    const updatedUser = await UserModel.save({
      idUser, status
    })
    return updatedUser
  } catch (error) {
    logger.error('Update user status: ' + (error as Error).name)
    throw error
  }
}

export const userGetAll = async (filterParams: IUserFilters, settings: IFilterSettings): Promise<IGetUsersResponse> => {
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
    logger.error('Get users: ' + (error as Error).name)
    throw error
  }
}

export const userGetById = async (idUser: number): Promise<IGetUniqueUser> => {
  try {
    const user = await UserModel.findOne({
      where: { idUser }
    })
    return { data: user }
  } catch (error) {
    logger.error('Get user by id: ' + (error as Error).name)
    throw error
  }
}

export const userGetByUserOrEmail = async (userOrEmail: string): Promise<IGetUniqueUser> => {
  try {
    const user = await UserModel.findOne({
      where: [
        { username: userOrEmail, status: true },
        { email: userOrEmail, status: true }
      ]
    })
    return { data: user }
  } catch (error) {
    logger.error('Get user by username or email: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (params: IUserFilters): IUserQueryParams => {
  const filters: IUserQueryParams = {}

  applyFilter(filters, 'name', params.name, true)
  applyFilter(filters, 'username', params.username, true)
  applyFilter(filters, 'email', params.email, true)
  applyFilter(filters, 'phoneNumber', params.phoneNumber, true)
  applyFilter(filters, 'idRole', params.idRole)
  applyFilter(filters, 'status', params.status)

  return filters
}

export const userRequitedValidations = async (username?: string, email?: string, idRole?: number, idUser?: number): Promise<void> => {
  if (username === undefined && email === undefined && idRole === undefined) return

  const userFilters: IUserQueryParams[] = []

  if (username !== undefined) {
    userFilters.push({ username })
  }

  if (email !== undefined) {
    userFilters.push({ email })
  }

  const [existUser, existRole] = await Promise.all([
    (username !== undefined || email !== undefined)
      ? UserModel.findOne({
        select: ['idUser', 'email', 'username'],
        where: userFilters
      })
      : Promise.resolve(null),

    (idRole !== undefined) ? roleGetById(idRole) : Promise.resolve(null)
  ])

  // Conditions for user and email
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

  // Conditions for roles
  if (idRole !== undefined && existRole?.data === null) {
    throw new IDRoleNotFoundError()
  }
}

const evaluateUserHierarchy = async (currUser: IUserJWT, idUserTarget: number): Promise<void> => {
  // allow own actions
  if (currUser.idUser === idUserTarget) {
    return
  }

  // Existing User
  const userTarget = await userGetById(idUserTarget)
  if ((userTarget.data as IUser)?.idUser === undefined) {
    throw new UserIDNotFoundError()
  }

  // evaluation hierarchy
  if (currUser.type === UserRoleEnum.SUBADMIN) {
    if ((userTarget.data as IUser).type === UserRoleEnum.ADMIN) {
      throw new UserActionNotAllowedError()
    }
  } else {
    throw new UserActionNotAllowedError()
  }
}

export const generateFirstUser = async (): Promise<void> => {
  // Verify user existence
  const usersCount = await UserModel.count()

  if (usersCount === 0) {
    const user = new UserModel()
    // User payload
    user.uuid = uuidv4()
    user.username = 'admin'
    user.name = envs.app.defaultUser.name
    user.email = envs.app.defaultUser.email
    user.notifications = true
    user.type = UserRoleEnum.ADMIN
    user.password = hashPassword(envs.app.defaultUser.password)
    // Create default and first user
    await UserModel.save(user)
    logger.info('Default user created successfully')
  }
}
