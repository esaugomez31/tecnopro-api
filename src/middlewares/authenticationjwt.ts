import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { logger } from '../helpers'
import envs from '../config/environment.config'
import { iUserJWT } from '../interfaces/user.interfaces'

export const authenticationJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.access_token

  if (token === undefined) {
    res.status(403).json({ error: 'Access Not Authorized' })
    return
  }

  try {
    const data = jwt.verify(token, envs.app.secret_jwt_key) as iUserJWT
    if (data?.id_user === undefined || data?.uuid === undefined || data?.username === undefined) {
      res.status(406).json({ error: 'Access Not Authorized' })
      return
    }

    req.session = data
    return next()
  } catch (error) {
    logger.error('Authentication error:', error)
    res.status(401).json({ error: 'Invalid Token' })
  }
}
