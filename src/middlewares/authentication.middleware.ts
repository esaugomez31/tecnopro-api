import { Request, Response, NextFunction } from 'express'
import { logger, verifyAccessToken } from '../helpers'
import {
  InvalidOrExpiredTokenError,
  AccessNotAuthorizedError,
  InvalidTokenError
} from '../errors/auth.error'

export const authenticationJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization?.split(' ')[1] ?? ''

  if (authorization === undefined) {
    throw new AccessNotAuthorizedError()
  }

  try {
    const data = verifyAccessToken(authorization)

    if (data?.idUser === undefined || data?.uuid === undefined || data?.idRole === undefined) {
      throw new InvalidTokenError()
    }

    req.session = data
    return next()
  } catch (error) {
    logger.error('Authentication error:', error)

    if (error instanceof AccessNotAuthorizedError) {
      res.status(403).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof InvalidTokenError || error instanceof InvalidOrExpiredTokenError) {
      res.status(401).json({ error: error.name, message: error.message })
      return
    }

    res.status(500).json({ error: 'Internal server error', message: 'Authentication error' })
  }
}
