import { body, query, param } from 'express-validator'
import { handleValidationErrors, stringToBoolean } from '../../helpers'
import { validateFilterParams } from './filter.validation'

const validSortFields = ['idBranch', 'name', 'description', 'phoneNumber', 'email', 'idCountry', 'idDepartment', 'idMunicipality']
const validDteEnvironment = ['00', '01']
const validDteEstablishment = ['01', '02', '03', '04']

const branchCommonValidations = (optional = false): any => [
  body('name')
    .optional(optional).isString().withMessage('name must be a string')
    .notEmpty().withMessage('name is required')
    .isLength({ min: 1, max: 100 }).withMessage('name must be between 1 and 100 characters long'),

  body('description')
    .optional().isString().withMessage('description must be a string')
    .notEmpty().withMessage('description is required')
    .isLength({ min: 1, max: 255 }).withMessage('description must be between 1 and 255 characters long'),

  body('phoneNumber')
    .optional().isString().withMessage('phoneNumber must be a string')
    .matches(/^\+\d{1,3} \d{6,12}$/).withMessage('phoneNumber must be in the format (+503 12345678)')
    .customSanitizer(value => value ?? null),

  body('email')
    .optional().isEmail().withMessage('email must be a valid email')
    .isLength({ max: 100 }).withMessage('dteSenderEmail length does not exceed 100 characters')
    .notEmpty().withMessage('email is required'),

  body('address')
    .optional().isString().withMessage('address must be a string')
    .notEmpty().withMessage('address is required')
    .isLength({ min: 1, max: 200 }).withMessage('address must be between 1 and 200 characters long'),

  body('idCountry')
    .optional(optional).isInt({ min: 1, max: 99999999999 }).withMessage('idCountry must be a integer between 1 and 99999999999')
    .notEmpty().withMessage('idCountry is required'),

  body('idDepartment')
    .optional(optional).isInt({ min: 1, max: 99999999999 }).withMessage('idDepartment must be a integer between 1 and 99999999999')
    .notEmpty().withMessage('idDepartment is required'),

  body('idMunicipality')
    .optional(optional).isInt({ min: 1, max: 99999999999 }).withMessage('idMunicipality must be a integer between 1 and 99999999999')
    .notEmpty().withMessage('idMunicipality is required'),

  // ########################################### DTE START ###########################################

  body('dteActive')
    .optional().isBoolean().withMessage('dteActive must be a boolean')
    .customSanitizer(stringToBoolean),

  body('dteEnvironment')
    .isIn(validDteEnvironment).withMessage(`dteEnvironment must be one of the following: ${validDteEnvironment.join(', ')}.`)
    .customSanitizer(value => value as string),

  body('dteApiJwt')
    .optional().isString().withMessage('dteApiJwt must be a string')
    .notEmpty().withMessage('dteApiJwt is required')
    .isLength({ min: 1, max: 255 }).withMessage('dteApiJwt must be between 1 and 255 characters long'),

  body('dteApiJwtDate')
    .optional().isDate().withMessage('dteApiJwtDate must be a datetime'),

  body('dteControlNumber')
    .optional().isString().withMessage('dteControlNumber must be a string')
    .notEmpty().withMessage('dteControlNumber is required')
    .isLength({ min: 31, max: 31 }).withMessage('dteControlNumber must be between 31 and 31 characters long'),

  body('dteSenderNit')
    .optional().isString().withMessage('dteSenderNit must be a string')
    .notEmpty().withMessage('dteSenderNit is required')
    .isLength({ min: 9, max: 14 }).withMessage('dteSenderNit must be between 9 and 14 characters long')
    .matches(/^[^-]+$/).withMessage('dteSenderNit must not contain hyphens'),

  body('dteSenderNrc')
    .optional().isString().withMessage('dteSenderNrc must be a string')
    .notEmpty().withMessage('dteSenderNrc is required')
    .isLength({ min: 2, max: 8 }).withMessage('dteSenderNrc must be between 2 and 8 characters long')
    .matches(/^[^-]+$/).withMessage('dteSenderNrc must not contain hyphens'),

  body('dteSenderEmail')
    .optional().isEmail().withMessage('dteSenderEmail must be a valid email')
    .isLength({ max: 100 }).withMessage('dteSenderEmail length does not exceed 100 characters')
    .notEmpty().withMessage('dteSenderEmail is required'),

  body('dteSenderPhone')
    .isString().withMessage('dteSenderPhone must be a string')
    .isLength({ max: 30 }).withMessage('dteSenderPhone length does not exceed 30 characters')
    .matches(/^(\d{8,30})(,\d{8,30}){0,2}$/) // allow three phone numbers, separates by commas
    .withMessage('dteSenderPhone must be between 8 and 30 digits long and can contain up to three numbers separated by commas'),

  body('dteActivityCode')
    .optional().isString().withMessage('dteActivityCode must be a string')
    .notEmpty().withMessage('dteActivityCode is required')
    .isLength({ min: 5, max: 6 }).withMessage('dteActivityCode must be between 5 and 6 characters long'),

  body('dteActivityDesc')
    .optional().isString().withMessage('dteActivityDesc must be a string')
    .notEmpty().withMessage('dteActivityDesc is required')
    .isLength({ min: 5, max: 150 }).withMessage('dteActivityDesc must be between 5 and 150 characters long'),

  body('dteSenderName')
    .optional().isString().withMessage('dteSenderName must be a string')
    .notEmpty().withMessage('dteSenderName is required')
    .isLength({ min: 1, max: 250 }).withMessage('dteSenderName must be between 1 and 250 characters long'),

  body('dteSenderTradeName')
    .optional().isString().withMessage('dteSenderTradeName must be a string')
    .notEmpty().withMessage('dteSenderTradeName is required')
    .isLength({ min: 1, max: 150 }).withMessage('dteSenderTradeName must be between 1 and 150 characters long'),

  body('dteEstablishment')
    .isIn(validDteEstablishment).withMessage(`dteEstablishment must be one of the following: ${validDteEstablishment.join(', ')}.`)
    .customSanitizer(value => value as string)

  // ########################################### DTE END ###########################################
]

export const validateBranchCreation = (): any => {
  return [
    ...branchCommonValidations(),

    handleValidationErrors
  ]
}

export const validateBranchUpdate = (): any => {
  return [
    param('idBranch')
      .isInt().withMessage('idBranch must be an integer')
      .customSanitizer(Number),

    ...branchCommonValidations(true),

    handleValidationErrors
  ]
}

export const validateBranchUpdateStatus = (): any => {
  return [
    param('idBranch')
      .isInt().withMessage('idBranch must be an integer')
      .customSanitizer(Number),

    param('status')
      .isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    handleValidationErrors
  ]
}

export const validateGetBranches = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query('name')
      .optional().isString().withMessage('name must be a string')
      .customSanitizer(value => value as string | undefined),

    query('description')
      .optional().isString().withMessage('description must be a string')
      .customSanitizer(value => value as string | undefined),

    query('email')
      .optional().isString().withMessage('email must be a string')
      .customSanitizer(value => value as string | undefined),

    query('phoneNumber')
      .optional().isString().withMessage('phoneNumber must be a string')
      .customSanitizer(value => value as string | undefined),

    query('uuid')
      .optional().isString().withMessage('uuid must be a string')
      .customSanitizer(value => value as string | undefined),

    query('status')
      .optional().isBoolean().withMessage('status must be a boolean')
      .customSanitizer(stringToBoolean),

    query('idCountry')
      .optional().isInt().withMessage('idCountry must be a integer')
      .customSanitizer(Number),

    query('idDepartment')
      .optional().isInt().withMessage('idDepartment must be a integer')
      .customSanitizer(Number),

    query('idMunicipality')
      .optional().isInt().withMessage('idMunicipality must be a integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}

export const validateGetBranchById = (): any => {
  return [
    param('idBranch')
      .isInt().withMessage('idBranch must be an integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}
