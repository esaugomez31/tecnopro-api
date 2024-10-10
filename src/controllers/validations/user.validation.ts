import { body } from 'express-validator'
import { handleValidationErrors } from '../../helpers'

export const validateUserCreation = (): any => {
  return [
    body('name')
      .isString().withMessage('name must be a string')
      .notEmpty().withMessage('name is required')
      .isLength({ min: 8, max: 40 }).withMessage('name must be between 8 and 20 characters long'),

    body('username')
      .isString().withMessage('username must be a string')
      .notEmpty().withMessage('username is required')
      .isLength({ min: 8, max: 20 }).withMessage('username must be between 8 and 20 characters long'),

    body('password')
      .isString().withMessage('password must be a string')
      .notEmpty().withMessage('password is required')
      .isLength({ min: 6 }).withMessage('password must be at least 6 characters long')
      .matches(/(?=.*[a-z])/).withMessage('password must contain at least one lowercase letter')
      .matches(/(?=.*[A-Z])/).withMessage('password must contain at least one uppercase letter')
      .matches(/(?=.*\d)/).withMessage('password must contain at least one number')
      .matches(/(?=.*[\W_])/).withMessage('password must contain at least one special character'),

    body('email')
      .isEmail().withMessage('email must be a valid email')
      .notEmpty().withMessage('email is required'),

    body('phone_number')
      .optional().isString().withMessage('phone_number must be a string')
      .matches(/^\+\d{1,3} \d{6,12}$/).withMessage('phone_number must be in the format (+503 12345678)'),

    body('whatsapp_number')
      .optional().isString().withMessage('whatsapp_number must be a string')
      .matches(/^\+\d{1,3} \d{6,12}$/).withMessage('whatsapp_number must be in the format (+503 12345678)'),

    body('notifications')
      .optional().isBoolean().withMessage('notifications must be a boolean')
      .custom((value: boolean, { req }) => {
        if (value && req.body?.whatsapp_number === undefined) {
          throw new Error('whatsapp_number is required when notifications is true')
        }
        return true
      }),

    body('id_rol')
      .optional()
      .custom(value => {
        if (value === null || typeof value === 'number') {
          return true
        }
        throw new Error('id_rol must be a number or null')
      }),

    handleValidationErrors
  ]
}

export const validateUserLogin = (): any => {
  return [
    body('usernameOrEmail')
      .isString().withMessage('usernameOrEmail must be a string')
      .notEmpty().withMessage('usernameOrEmail is required'),

    body('password')
      .isString().withMessage('password must be a string')
      .notEmpty().withMessage('password is required'),

    handleValidationErrors
  ]
}
