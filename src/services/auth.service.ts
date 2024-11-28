import { IUserJWT, ILoginResponse, UserRoleEnum } from '../interfaces'
import {
  tokenCreate,
  getActiveUSerToken,
  deleteTokenById
} from './tokens.service'
import {
  userUpdateLastLogin,
  userGetByUserOrEmail
} from './users.service'
import {
  logger,
  verifyRefreshToken,
  generateAccessToken,
  getLocalDateTimeNow,
  comparePassword,
  generateRefreshToken
} from '../helpers'
import {
  AccessNotAuthorizedError,
  InvalidTokenError,
  ExpiredTokenError
} from '../errors/auth.error'
import {
  InvalidUserCredentialsError,
  UserNotFoundError
} from '../errors/user.error'

export const login = async (usernameOrEmail: string, password: string): Promise<ILoginResponse> => {
  try {
    // Searching for credential matches
    const { data } = await userGetByUserOrEmail(usernameOrEmail)

    if (data === null) {
      throw new UserNotFoundError()
    }

    // comparing encrypted password with bcrypt
    if (!comparePassword(password, data.password)) {
      throw new InvalidUserCredentialsError()
    }

    // new user object
    const { password: _, ...newUser } = data

    // JWT payload
    const jwtPayload: IUserJWT = {
      idUser: data.idUser as number,
      uuid: data.uuid,
      idRole: data.idRole,
      type: data.type as UserRoleEnum
    }

    // Generate access and refresh token
    const accessToken = generateAccessToken(jwtPayload)
    const refreshToken = generateRefreshToken(jwtPayload)

    // Update last login and creating token
    const expiredAt = new Date()
    expiredAt.setDate(expiredAt.getDate() + 7) // 7 days

    await Promise.all([
      userUpdateLastLogin(data.idUser as number, new Date(getLocalDateTimeNow())),
      tokenCreate({
        idUser: Number(data?.idUser),
        token: refreshToken.token,
        expiredAt
      })
    ])

    return {
      accessToken,
      refreshToken,
      user: newUser
    }
  } catch (error) {
    logger.error('Login user: ' + (error as Error).name)
    throw error
  }
}

export const logout = async (refreshToken?: string): Promise<boolean> => {
  try {
    if (refreshToken === undefined) {
      throw new AccessNotAuthorizedError()
    }

    // Eval refresh token
    const data = verifyRefreshToken(refreshToken)
    if (data?.idUser === undefined || data?.uuid === undefined || data?.type === undefined) {
      throw new InvalidTokenError()
    }

    // Find refresh token
    const tokenUser = await getActiveUSerToken(data.idUser, refreshToken)

    if (tokenUser === null) {
      throw new ExpiredTokenError()
    }

    const tokenDeleted = await deleteTokenById(tokenUser.idToken as number)
    if (!tokenDeleted) {
      throw new ExpiredTokenError()
    }

    return tokenDeleted
  } catch (error) {
    logger.error('Logout user: ' + (error as Error).name)
    throw error
  }
}

export const refresh = async (refreshToken?: string): Promise<{ token: string, expiresIn: number }> => {
  try {
    if (refreshToken === undefined) {
      throw new AccessNotAuthorizedError()
    }

    // Eval refresh token
    const data = verifyRefreshToken(refreshToken)
    if (data?.idUser === undefined || data?.uuid === undefined || data?.type === undefined) {
      throw new InvalidTokenError()
    }

    // Find refresh token
    const tokenUser = await getActiveUSerToken(data.idUser, refreshToken)

    if (tokenUser === null) {
      throw new ExpiredTokenError()
    }

    // Generating new access token
    const { token, expiresIn } = generateAccessToken({
      idUser: data.idUser,
      uuid: data.uuid,
      idRole: data.idRole,
      type: data.type
    })

    return { token, expiresIn }
  } catch (error) {
    logger.error('Refresh token: ' + (error as Error).name)
    throw error
  }
}
