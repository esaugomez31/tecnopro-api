import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import envs from '../config/environment.config'
import * as userService from '../services/users.service'
import { iUserJWT, iUserFilterParams } from '../interfaces/user.interfaces'
import {
  InvalidUserCredentialsError,
  UsernameExistsError,
  UserNotFoundError,
  EmailExistsError
} from '../errors/user.error'

export const userCreateController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Receiving the body parameters
    const data = req.body
    const users = await userService.userCreate(data)

    res.json(users)
  } catch (error) {
    if (error instanceof UsernameExistsError || error instanceof EmailExistsError) {
      res.status(409).json({ error: error.name })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const userLoginController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Receiving the body parameters
    const { usernameOrEmail, password } = req.body
    const user = await userService.userLogin(usernameOrEmail, password)
    // Create JWT token
    const jwtPayload: iUserJWT = {
      idUser: user.idUser, uuid: user.uuid, username: user.username
    }
    const token = jwt.sign(
      jwtPayload,
      envs.app.secretJwtKey,
      {
        expiresIn: '1h'
      }
    )

    // Sending cookie access token to client
    user.accessToken = token
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: envs.app.nodeEnv === 'production', // true only in production
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 1 // 1h duration
    })
    res.json(user)
  } catch (error) {
    if (error instanceof InvalidUserCredentialsError) {
      res.status(401).json({ error: error.name })
      return
    }

    if (error instanceof UserNotFoundError) {
      res.status(404).json({ error: error.name })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const userLogoutController = async (_: Request, res: Response): Promise<void> => {
  res.clearCookie('accessToken').send({
    message: 'Successful Logout'
  })
}

export const userGetAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: iUserFilterParams = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      username: req.query.username as string | undefined,
      name: req.query.name as string | undefined,
      email: req.query.email as string | undefined,
      idRol: req.query.idRol as number | undefined
    }
    const users = await userService.userGetAll(params)

    res.json(users)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
