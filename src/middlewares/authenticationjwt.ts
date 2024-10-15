import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { logger } from '../helpers'
import envs from '../config/environment.config'
import { iUserJWT } from '../interfaces/user.interfaces'

export const authenticationJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token: string | undefined = req.cookies.accessToken

  if (token === undefined) {
    res.status(403).json({ error: 'Access not authorized' })
    return
  }

  try {
    const data = jwt.verify(token, envs.app.secretJwtKey) as iUserJWT
    if (data?.idUser === undefined || data?.uuid === undefined || data?.username === undefined) {
      res.status(400).json({ error: 'Invalid token' })
      return
    }

    req.session = data
    return next()
  } catch (error) {
    logger.error('Authentication error:', error)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
