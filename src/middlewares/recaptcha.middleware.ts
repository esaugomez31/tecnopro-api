import { Request, Response, NextFunction } from "express"

import { logger, verifyReCaptchaToken } from "../helpers"
import envs from "../config/environment.config"
import {
  ValidationErrorError,
  RecaptchaServerError,
} from "../errors/helpers/recaptcha.error"

const { app } = envs

export const verifyRecaptcha = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = String(req.headers?.recaptchatoken ?? "")

  if (!app.recaptcha.enabled) {
    return next()
  }

  try {
    const recaptchaRes = await verifyReCaptchaToken(token)

    if (!recaptchaRes) {
      throw new Error("Some recaptcha error")
    }

    return next()
  } catch (error) {
    logger.error("Authentication error:", error)

    if (error instanceof ValidationErrorError) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof RecaptchaServerError) {
      res.status(500).json({ error: error.name, message: error.message })
      return
    }

    res.status(500).json({ error: "Internal server error", message: "Recaptcha error" })
  }
}
