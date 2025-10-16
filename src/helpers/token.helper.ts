import { Response } from "express"
import jwt from "jsonwebtoken"

import envs from "../config/environment.config"
import { IUserJWT } from "../interfaces"
import { InvalidOrExpiredTokenError } from "../errors/auth.error"

export const generateAccessToken = (
  payload: IUserJWT,
): { token: string; expiresIn: number } => {
  const expiresIn = 60 * 15 // 15 minutes
  const accessToken = jwt.sign(payload, envs.app.secretJwtKey, { expiresIn })

  return { token: accessToken, expiresIn }
}

export const generateRefreshToken = (
  payload: IUserJWT,
): { token: string; expiresIn: number } => {
  const expiresIn = 60 * 60 * 24 * 7 // 7 days
  const refreshToken = jwt.sign(payload, envs.app.secretJwtRefreshKey, { expiresIn })

  return { token: refreshToken, expiresIn }
}

export const generateRefreshCookie = (
  refreshToken: string,
  expiresIn: number,
  res: Response,
): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevents the token from being accessible from JavaScript
    secure: process.env.NODE_ENV === "production", // Allow only https conections
    sameSite: "strict", // Prevents sending the token in requests from other sites (prevents CSRF)
    maxAge: expiresIn * 1000,
  })
}

export const verifyAccessToken = (token: string): IUserJWT => {
  try {
    return jwt.verify(token, envs.app.secretJwtKey) as IUserJWT
  } catch (_error) {
    throw new InvalidOrExpiredTokenError()
  }
}

export const verifyRefreshToken = (token: string): IUserJWT => {
  try {
    return jwt.verify(token, envs.app.secretJwtRefreshKey) as IUserJWT
  } catch (_error) {
    throw new InvalidOrExpiredTokenError()
  }
}
