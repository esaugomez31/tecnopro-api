import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import envs from '../config/environment.config'
import * as userService from '../services/users.service'
import { UserModel, UserRoleEnum } from '../models'
import { filtersettings } from '../helpers'
import { IDRoleNotFoundError } from '../errors/role.error'
import {
  InvalidUserCredentialsError,
  UsernameExistsError,
  UserNotFoundError,
  EmailExistsError
} from '../errors/user.error'
import {
  iUserJWT,
  iUserFilters,
  iUserGetCustomRequest,
  iUserCommonRequest
} from '../interfaces'

export const userSignupController = async (req: iUserCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body

    // Model user object
    const payload = new UserModel()
    payload.name = body.name
    payload.username = body.username
    payload.password = body.password
    payload.phoneNumber = body.phoneNumber
    payload.whatsappNumber = body.whatsappNumber
    payload.email = body.email
    payload.notifications = body.notifications
    payload.idRole = body.idRole

    const { password: _, ...user } = await userService.userSignup(payload)

    res.json(user)
  } catch (error) {
    if (error instanceof UsernameExistsError || error instanceof EmailExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof IDRoleNotFoundError) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const userUpdateController = async (req: iUserCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body
    const idUser = Number(req.params.idUser)

    // Model user object
    const payload = new UserModel()
    payload.name = body.name
    payload.username = body.username
    payload.password = body.password
    payload.phoneNumber = body.phoneNumber
    payload.whatsappNumber = body.whatsappNumber
    payload.email = body.email
    payload.notifications = body.notifications
    payload.idRole = body.idRole

    const { password: _, ...user } = await userService.userUpdate(payload, idUser)

    res.json(user)
  } catch (error) {
    if (error instanceof UsernameExistsError || error instanceof EmailExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof IDRoleNotFoundError) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const userUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idUser = Number(req.params.idUser)
    const status = Boolean(req.params.status)

    const { password: _, ...user } = await userService.userUpdateStatus(idUser, status)

    res.json(user)
  } catch (error) {
    if (error instanceof UsernameExistsError || error instanceof EmailExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const userLoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body
    // Login user controller
    const user = await userService.userLogin(usernameOrEmail, password)

    // Create JWT token
    const jwtPayload: iUserJWT = {
      idUser: user.idUser as number,
      uuid: user.uuid,
      idRole: user.idRole,
      type: user.type as UserRoleEnum
    }
    const token = jwt.sign(
      jwtPayload,
      envs.app.secretJwtKey,
      {
        expiresIn: '1h'
      }
    )

    // Sending cookie accessToken to client
    user.accessToken = token
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: envs.app.nodeEnv === 'production', // Only in production
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 1 // 1h duration
    })
    res.json(user)
  } catch (error) {
    if (error instanceof InvalidUserCredentialsError) {
      res.status(401).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof UserNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const userLogoutController = async (_: Request, res: Response): Promise<void> => {
  res.clearCookie('accessToken').send({
    message: 'Successful logout'
  })
}

export const userGetAllController = async (req: iUserGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params user
    const params: iUserFilters = {
      username: query.username,
      name: query.name,
      email: query.email,
      phoneNumber: query.phoneNumber,
      status: query.status,
      idRole: query.idRole
    }

    const users = await userService.userGetAll(params, settings)

    res.json(users)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const userGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user id param
    const idUser: number = Number(req.params.idUser)

    const users = await userService.userGetById(idUser)

    res.json(users)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
