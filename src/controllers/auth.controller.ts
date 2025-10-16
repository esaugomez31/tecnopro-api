import { Request, Response } from "express"

import * as authService from "../services/auth.service"
import { generateRefreshCookie } from "../helpers"
import {
  InvalidOrExpiredTokenError,
  AccessNotAuthorizedError,
  InvalidTokenError,
  ExpiredTokenError,
} from "../errors/auth.error"
import { InvalidUserCredentialsError, UserNotFoundError } from "../errors/user.error"

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body
    // Login user controller
    const { refreshToken, accessToken, user } = await authService.login(
      usernameOrEmail,
      password,
    )

    generateRefreshCookie(refreshToken.token, refreshToken.expiresIn, res)

    // Sending response
    res.json({
      user,
      accessToken: accessToken.token,
      expiresIn: accessToken.expiresIn,
      refreshExpiresIn: refreshToken.expiresIn,
    })
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
    res.status(500).json({ error: "Internal server error" })
  }
}

export const refreshTokenController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const refreshToken: string | undefined = req.cookies.refreshToken

    // Eval refresh token
    const { token, expiresIn } = await authService.refresh(refreshToken)

    res.json({ accessToken: token, expiresIn })
  } catch (error) {
    if (
      error instanceof InvalidTokenError ||
      error instanceof ExpiredTokenError ||
      error instanceof InvalidOrExpiredTokenError
    ) {
      res.status(401).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof AccessNotAuthorizedError) {
      res.status(403).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken: string | undefined = req.cookies.refreshToken

    // logout service
    await authService.logout(refreshToken)

    res.clearCookie("refreshToken").json({
      message: "Successful logout",
    })
  } catch (error) {
    if (
      error instanceof InvalidTokenError ||
      error instanceof ExpiredTokenError ||
      error instanceof InvalidOrExpiredTokenError
    ) {
      res.status(401).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof AccessNotAuthorizedError) {
      res.status(403).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}
