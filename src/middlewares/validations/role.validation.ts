import { body, query, param } from 'express-validator'
import { handleValidationErrors, stringToBoolean } from '../../helpers'
import { validateFilterParams } from './filter.validation'

const validSortFields = ['idRole', 'name']

const roleCommonValidations = (optional = false): any => [
  body('name')
    .optional(optional).isString().withMessage('name must be a string')
    .notEmpty().withMessage('name is required')
    .isLength({ min: 8, max: 25 }).withMessage('name must be between 8 and 20 characters long')
]

export const validateRoleCreation = (): any => {
  return [
    ...roleCommonValidations(),

    handleValidationErrors
  ]
}

export const validateRoleUpdate = (): any => {
  return [
    param('idRole')
      .isInt().withMessage('idRole must be an integer')
      .customSanitizer(Number),

    ...roleCommonValidations(true),

    handleValidationErrors
  ]
}

export const validateRoleUpdateStatus = (): any => {
  return [
    param('idRole')
      .isInt().withMessage('idRole must be an integer')
      .customSanitizer(Number),

    param('status')
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    handleValidationErrors
  ]
}

export const validateGetRoles = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query('name')
      .optional().isString().withMessage('name must be a string')
      .customSanitizer(value => value as string | undefined),

    query('status')
      .optional().isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    handleValidationErrors
  ]
}

export const validateGetRoleById = (): any => {
  return [
    param('idRole')
      .isInt().withMessage('idRole must be an integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}
