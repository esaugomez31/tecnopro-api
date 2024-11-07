import { body, query, param } from 'express-validator'
import { handleValidationErrors, stringToBoolean } from '../../helpers'
import { validateFilterParams } from './filter.validation'

const validSortFields = ['idBrand', 'name', 'description']

const brandCommonValidations = (optional = false): any => [
  body('name')
    .optional(optional)
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 50 }).withMessage('name must be between 1 and 50 characters long'),

  body('description')
    .optional({ checkFalsy: true })
    .isString().withMessage('description must be a string')
    .isLength({ max: 250 }).withMessage('description must have a maximum of 250 characters')
]

export const validateBrandCreation = (): any => {
  return [
    ...brandCommonValidations(),

    handleValidationErrors
  ]
}

export const validateBrandUpdate = (): any => {
  return [
    param('idBrand')
      .isInt().withMessage('idBrand must be an integer')
      .customSanitizer(Number),

    ...brandCommonValidations(true),

    handleValidationErrors
  ]
}

export const validateBrandUpdateStatus = (): any => {
  return [
    param('idBrand')
      .isInt().withMessage('idBrand must be an integer')
      .customSanitizer(Number),

    param('status')
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    handleValidationErrors
  ]
}

export const validateGetBrands = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query('name')
      .optional()
      .isString().withMessage('name must be a string')
      .customSanitizer(value => value as string | undefined),

    query('status')
      .optional()
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    query('description')
      .optional()
      .isString().withMessage('description must be a string')
      .customSanitizer(value => value as string | undefined),

    query('uuid')
      .optional()
      .isString().withMessage('uuid must be a string')
      .customSanitizer(value => value as string | undefined),

    handleValidationErrors
  ]
}

export const validateGetBrandById = (): any => {
  return [
    param('idBrand')
      .isInt().withMessage('idBrand must be an integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}
