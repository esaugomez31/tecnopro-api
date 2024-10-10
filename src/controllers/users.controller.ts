import { Request, Response } from 'express'
import * as userService from '../services/users.service'
import {
  InvalidUserCredentialsError,
  UsernameExistsError,
  EmailExistsError
} from '../errors/user.error'

export const userCreateController = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Receiving the body parameters
    const data = req.body
    const users = await userService.userCreate(data)

    return res.json(users)
  } catch (error) {
    if (error instanceof UsernameExistsError || error instanceof EmailExistsError) {
      return res.status(409).json({ error: error.name })
    }
    // Default error message
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const userLoginController = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Receiving the body parameters
    const { usernameOrEmail, password } = req.body
    const users = await userService.userLogin(usernameOrEmail, password)

    return res.json(users)
  } catch (error) {
    if (error instanceof InvalidUserCredentialsError) {
      return res.status(401).json({ error: error.name })
    }
    // Default error message
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
