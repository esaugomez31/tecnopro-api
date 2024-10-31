import { body, query, param } from 'express-validator'
import { handleValidationErrors, stringToBoolean } from '../../helpers'
import { validateFilterParams } from './filter.validation'

const validSortFields = ['idMunicipality', 'name', 'dteCode', 'zipCode', 'idCountry', 'idDepartment']

const municipalityCommonValidations = (optional = false): any => [
  body('name')
    .optional(optional).isString().withMessage('name must be a string')
    .notEmpty().withMessage('name is required')
    .isLength({ min: 1, max: 85 }).withMessage('name must be between 1 and 85 characters long'),

  body('zipCode')
    .optional().isString().withMessage('code must be a string')
    .notEmpty().withMessage('zipCode is required')
    .isLength({ min: 1, max: 10 }).withMessage('zipCode must be between 1 and 10 characters long'),

  body('dteCode')
    .optional().isString().withMessage('dteCode must be a string')
    .notEmpty().withMessage('dteCode is required')
    .isLength({ min: 1, max: 2 }).withMessage('dteCode must be between 1 and 2 characters long'),

  body('idCountry')
    .optional(optional).isInt({ min: 1, max: 99999999999 }).withMessage('idCountry must be a integer between 1 and 99999999999')
    .notEmpty().withMessage('idCountry is required'),

  body('idDepartment')
    .optional(optional).isInt({ min: 1, max: 99999999999 }).withMessage('idDepartment must be a integer between 1 and 99999999999')
    .notEmpty().withMessage('idDepartment is required')
]

export const validateMunicipalityCreation = (): any => {
  return [
    ...municipalityCommonValidations(),

    handleValidationErrors
  ]
}

export const validateMunicipalityUpdate = (): any => {
  return [
    param('idMunicipality')
      .isInt().withMessage('idMunicipality must be an integer')
      .customSanitizer(Number),

    ...municipalityCommonValidations(true),

    handleValidationErrors
  ]
}

export const validateMunicipalityUpdateStatus = (): any => {
  return [
    param('idMunicipality')
      .isInt().withMessage('idMunicipality must be an integer')
      .customSanitizer(Number),

    param('status')
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    handleValidationErrors
  ]
}

export const validateGetMunicipalities = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query('name')
      .optional().isString().withMessage('name must be a string')
      .customSanitizer(value => value as string | undefined),

    query('status')
      .optional().isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    query('dteCode')
      .optional().isString().withMessage('dteCode must be a string')
      .customSanitizer(value => value as string | undefined),

    query('zipCode')
      .optional().isString().withMessage('zipCode must be a string')
      .customSanitizer(value => value as string | undefined),

    query('idCountry')
      .optional().isInt().withMessage('idCountry must be a integer')
      .customSanitizer(Number),

    query('idDepartment')
      .optional().isInt().withMessage('idDepartment must be a integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}

export const validateGetMunicipalityById = (): any => {
  return [
    param('idMunicipality')
      .isInt().withMessage('idMunicipality must be an integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}
