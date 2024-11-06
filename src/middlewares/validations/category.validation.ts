import { body, query, param } from 'express-validator'
import { handleValidationErrors, stringToBoolean } from '../../helpers'
import { validateFilterParams } from './filter.validation'

const validSortFields = ['idCategory', 'name', 'description']

const categoryCommonValidations = (optional = false): any => [
  body('name')
    .optional(optional)
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 50 }).withMessage('name must be between 1 and 50 characters long'),

  body('description')
    .optional()
    .isString().withMessage('description must be a string')
    .isLength({ min: 1, max: 250 }).withMessage('description must be between 1 and 250 characters long')
]

export const validateCategoryCreation = (): any => {
  return [
    ...categoryCommonValidations(),

    handleValidationErrors
  ]
}

export const validateCategoryUpdate = (): any => {
  return [
    param('idCategory')
      .isInt().withMessage('idCategory must be an integer')
      .customSanitizer(Number),

    ...categoryCommonValidations(true),

    handleValidationErrors
  ]
}

export const validateCategoryUpdateStatus = (): any => {
  return [
    param('idCategory')
      .isInt().withMessage('idCategory must be an integer')
      .customSanitizer(Number),

    param('status')
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    handleValidationErrors
  ]
}

export const validateGetCategories = (): any => {
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

export const validateGetCategoryById = (): any => {
  return [
    param('idCategory')
      .isInt().withMessage('idCategory must be an integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}
