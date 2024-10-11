import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import envs from '../config/environment.config'
import * as userService from '../services/users.service'
import { iUserJWT } from '../interfaces/user.interfaces'
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
      id_user: user.id_user, uuid: user.uuid, username: user.username
    }
    const token = jwt.sign(
      jwtPayload,
      envs.app.secret_jwt_key,
      {
        expiresIn: '10h'
      }
    )

    // Sending cookie access token to client
    user.access_token = token
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: envs.app.node_env === 'production', // true only in production
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 8 // 8h duration
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
  res.clearCookie('access_token').send({
    message: 'Successful Logout'
  })
}
