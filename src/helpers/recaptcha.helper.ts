import axios from 'axios'
import envs from '../config/environment.config'
import { IRecaptchaResponse } from '../interfaces/helpers'
import { ValidationErrorError, RecaptchaServerError } from '../errors/helpers/recaptcha.error'

export const verifyReCaptchaToken = async (token: string): Promise<boolean> => {
  try {
    // Sent token to Google to validate
    const response = await axios.post<IRecaptchaResponse>(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: envs.app.recaptcha.privateKey,
        response: token
      }).toString(),
      {
        headers: {
          'Content-Type':
          'application/x-www-form-urlencoded'
        }
      }
    )

    const data = response.data

    if (!data.success) {
      throw new ValidationErrorError()
    }

    return true
  } catch (error) {
    console.error('ReCAPTCHA error:', error)

    if (!(error instanceof ValidationErrorError)) {
      throw new RecaptchaServerError()
    }

    throw error
  }
}
