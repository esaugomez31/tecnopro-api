import { body, query, param } from 'express-validator'

import { handleValidationErrors, stringToBoolean } from '../../../helpers'
import { validateFilterParams, validateIncludeParams } from '../filter.validation'

const validSortFields = ['idCountry', 'name', 'code', 'zipCode']
const validIncludeFields = ['departments', 'municipalities']

const countryCommonValidations = (optional = false): any => [
  body('name')
    .optional(optional)
    .isString().withMessage('name must be a string')
    .isLength({ min: 1, max: 50 }).withMessage('name must be between 1 and 50 characters long'),

  body('code')
    .optional({ checkFalsy: true })
    .isString().withMessage('code must be a string')
    .isLength({ min: 1, max: 3 }).withMessage('code must be between 1 and 3 characters long'),

  body('zipCode')
    .optional({ checkFalsy: true })
    .isString().withMessage('zipCode must be a string')
    .isLength({ min: 1, max: 10 }).withMessage('zipCode must be between 1 and 10 characters long'),

  body('timeZone')
    .optional({ checkFalsy: true })
    .isString().withMessage('timeZone must be a string')
    .isLength({ min: 1, max: 50 }).withMessage('timeZone must be between 1 and 50 characters long')
]

export const validateCountryCreation = (): any => {
  return [
    ...countryCommonValidations(),

    handleValidationErrors
  ]
}

export const validateCountryUpdate = (): any => {
  return [
    param('idCountry')
      .isInt().withMessage('idCountry must be an integer')
      .customSanitizer(Number),

    ...countryCommonValidations(true),

    handleValidationErrors
  ]
}

export const validateCountryUpdateStatus = (): any => {
  return [
    param('idCountry')
      .isInt().withMessage('idCountry must be an integer')
      .customSanitizer(Number),

    param('status')
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    handleValidationErrors
  ]
}

export const validateGetCountries = (): any => {
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

    query('code')
      .optional()
      .isString().withMessage('code must be a string')
      .customSanitizer(value => value as string | undefined),

    query('zipCode')
      .optional()
      .isString().withMessage('zipCode must be a string')
      .customSanitizer(value => value as string | undefined),

    ...validateIncludeParams(validIncludeFields),

    handleValidationErrors
  ]
}

export const validateGetCountryById = (): any => {
  return [
    param('idCountry')
      .isInt().withMessage('idCountry must be an integer')
      .customSanitizer(Number),

    ...validateIncludeParams(validIncludeFields),

    handleValidationErrors
  ]
}
