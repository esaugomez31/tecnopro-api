import { Request, Response } from 'express'
import * as userService from '../services/users.service'
import {
  InvalidUserCredentialsError
} from '../errors/user.error'

export const userController = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Receiving the body parameters
    const { username, password } = req.body
    const users = await userService.userLogin(username, password)

    return res.json(users)
  } catch (error) {
    if (error instanceof InvalidUserCredentialsError) {
      return res.status(401).json({ message: error.name })
    }
    // Default error message
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
