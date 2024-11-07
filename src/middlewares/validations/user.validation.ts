import { body, query, param } from 'express-validator'
import { handleValidationErrors, stringToBoolean } from '../../helpers'
import { validateFilterParams } from './filter.validation'

const validSortFields = ['idUser', 'username', 'name', 'email', 'idRole']

const userCommonValidations = (optional = false): any => [
  body('name')
    .optional(optional)
    .isString().withMessage('name must be a string')
    .isLength({ min: 8, max: 40 }).withMessage('name must be between 8 and 40 characters long'),

  body('username')
    .optional(optional)
    .isString().withMessage('username must be a string')
    .isLength({ min: 8, max: 20 }).withMessage('username must be between 8 and 20 characters long'),

  body('password')
    .optional(optional)
    .isString().withMessage('password must be a string')
    .isLength({ min: 6, max: 32 }).withMessage('password must be at least 6 characters long')
    .matches(/(?=.*[a-z])/).withMessage('password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/).withMessage('password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/).withMessage('password must contain at least one number')
    .matches(/(?=.*[\W_])/).withMessage('password must contain at least one special character'),

  body('email')
    .optional(optional)
    .isEmail().withMessage('email must be a valid email')
    .isLength({ max: 100 }).withMessage('email length does not exceed 100 characters'),

  body('phoneNumber')
    .optional({ checkFalsy: true })
    .isString().withMessage('phoneNumber must be a string')
    .matches(/^\+\d{1,3} \d{6,12}$/).withMessage('phoneNumber must be in the format (+503 12345678)'),

  body('whatsappNumber')
    .optional({ checkFalsy: true })
    .isString().withMessage('whatsappNumber must be a string')
    .matches(/^\+\d{1,3} \d{6,12}$/).withMessage('whatsappNumber must be in the format (+503 12345678)'),

  body('notifications')
    .optional()
    .isBoolean().withMessage('notifications must be a boolean')
    .custom((value: boolean, { req }) => {
      if (value && (req.body?.whatsappNumber === undefined || req.body?.whatsappNumber === '')) {
        throw new Error('whatsappNumber is required when notifications is true')
      }
      return true
    })
    .customSanitizer(value => stringToBoolean(value) === true),

  body('idRole')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 99999999999 }).withMessage('idRole must be a integer between 1 and 99999999999')
]

export const validateUserSignup = (): any => {
  return [
    ...userCommonValidations(),

    handleValidationErrors
  ]
}

export const validateUserUpdate = (): any => {
  return [
    param('idUser')
      .isInt().withMessage('idUser must be an integer')
      .customSanitizer(Number),

    ...userCommonValidations(true),

    handleValidationErrors
  ]
}

export const validateUserUpdateStatus = (): any => {
  return [
    param('idUser')
      .isInt().withMessage('idUser must be an integer')
      .customSanitizer(Number),

    param('status')
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

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

export const validateGetUsers = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query('username')
      .optional()
      .isString().withMessage('username must be a string')
      .customSanitizer(value => value as string | undefined),

    query('name')
      .optional()
      .isString().withMessage('name must be a string')
      .customSanitizer(value => value as string | undefined),

    query('email')
      .optional()
      .isString().withMessage('email must be a string')
      .customSanitizer(value => value as string | undefined),

    query('phoneNumber')
      .optional()
      .isString().withMessage('phoneNumber must be a string')
      .customSanitizer(value => value as string | undefined),

    query('status')
      .optional()
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    query('idRole')
      .optional()
      .isInt().withMessage('idRole must be an integer')
      .customSanitizer(value => value as number | undefined),

    handleValidationErrors
  ]
}

export const validateGetUserById = (): any => {
  return [
    param('idUser')
      .isInt().withMessage('idUser must be an integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}
