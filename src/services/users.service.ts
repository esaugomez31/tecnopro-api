import { v4 as uuidv4 } from 'uuid'
import { Like } from 'typeorm'
import envs from '../config/environment.config'
import { UserModel, RoleModel, UserRoleEnum } from '../models'
import { logger, hashPassword, comparePassword, getLocalDateTimeNow } from '../helpers'
import {
  iFilterSettings,
  iUserPublicResponse,
  iUserFilters,
  iUserQueryParams,
  iGetUsersResponse,
  iGetUserByIdResponse,
  iUserJWT
} from '../interfaces'
import {
  InvalidUserCredentialsError,
  UserActionNotAllowedError,
  UsernameExistsError,
  UserIDNotFoundError,
  UserNotFoundError,
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
      type: user.type,
      notifications: user.notifications,
      lastLogin: user.lastLogin,
      timeZone: user.timeZone,
      idRole: user.idRole,
      accessToken: null
    }
  } catch (error) {
    logger.error('Login user: ' + (error as Error).name)
    throw error
  }
}

export const userSignup = async (user: UserModel): Promise<UserModel> => {
  try {
    // Searching for username or email matches
    await userRequitedValidations(user.username, user.email, user.idRole)
    // Generate UUID
    user.uuid = uuidv4()
    // Hash password
    user.password = hashPassword(user.password)

    // Signup user
    const newUser = await UserModel.save(user)
    return newUser
  } catch (error) {
    logger.error('Signup user: ' + (error as Error).name)
    throw error
  }
}

export const userUpdate = async (user: UserModel, idUser: number, jwtData: iUserJWT): Promise<UserModel> => {
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

export const userUpdateStatus = async (idUser: number, status: boolean, jwtData: iUserJWT): Promise<UserModel> => {
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
    logger.error('Get users: ' + (error as Error).name)
    throw error
  }
}

export const userGetById = async (idUser: number): Promise<iGetUserByIdResponse> => {
  try {
    const user = await UserModel.findOne({
      where: { idUser }
    })
    return { data: user ?? {} }
  } catch (error) {
    logger.error('Get user by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iUserFilters): iUserQueryParams => {
  const filters: iUserQueryParams = {}
  const { username, name, email, idRole, phoneNumber, status } = filterParams

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

  if (idRole !== undefined) {
    filters.idRole = idRole
  }

  return filters
}

const userRequitedValidations = async (username?: string, email?: string, idRole?: number, idUser?: number): Promise<void> => {
  if (username === undefined && email === undefined && idRole === undefined) return

  const userFilters: iUserQueryParams[] = []

  if (username !== undefined) {
    userFilters.push({ username })
  }

  if (email !== undefined) {
    userFilters.push({ email })
  }

  const [existUser, existRole]: [UserModel | null, RoleModel | null] = await Promise.all([
    (username !== undefined || email !== undefined)
      ? UserModel.findOne({
        select: ['idUser', 'email', 'username'],
        where: userFilters
      })
      : Promise.resolve(null),

    (idRole !== undefined)
      ? RoleModel.findOne({ where: { idRole } })
      : Promise.resolve(null)
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
  if ((idRole !== undefined && idRole !== null) && existRole === null) {
    throw new IDRoleNotFoundError()
  }
}

const evaluateUserHierarchy = async (currUser: iUserJWT, idUserTarget: number): Promise<void> => {
  // allow own actions
  if (currUser.idUser === idUserTarget) {
    return
  }

  // Existing User
  const userTarget = await userGetById(idUserTarget)
  if ((userTarget.data as UserModel)?.idUser === undefined) {
    throw new UserIDNotFoundError()
  }

  // evaluation hierarchy
  if (currUser.type === UserRoleEnum.SUBADMIN) {
    if ((userTarget.data as UserModel).type === UserRoleEnum.ADMIN) {
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
