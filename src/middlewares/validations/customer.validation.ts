import { body, query, param } from "express-validator"

import { handleValidationErrors, stringToBoolean } from "../../helpers"

import { validateFilterParams } from "./filter.validation"

const validSortFields = [
  "idCustomer",
  "name",
  "phoneNumbers",
  "email",
  "idCountry",
  "idDepartment",
  "idMunicipality",
]

const customerCommonValidations = (optional = false): any => [
  body("name")
    .optional(optional)
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 1, max: 75 })
    .withMessage("name must be between 1 and 75 characters long"),

  body("tradeName")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("tradeName must be a string")
    .isLength({ max: 150 })
    .withMessage("tradeName must have a maximum of 150 characters"),

  body("dui")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("dui must be a string")
    .isLength({ min: 9, max: 30 })
    .withMessage("dui must be between 9 and 30 characters long")
    .matches(/^\d+$/)
    .withMessage("dui must contain only numbers"),

  body("nit")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("nit must be a string")
    .isLength({ min: 9, max: 14 })
    .withMessage("nit must be between 9 and 14 characters long")
    .matches(/^\d+$/)
    .withMessage("nit must contain only numbers"),

  body("nrc")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("nrc must be a string")
    .isLength({ min: 2, max: 8 })
    .withMessage("nrc must be between 2 and 8 characters long")
    .matches(/^\d+$/)
    .withMessage("nrc must contain only numbers"),

  body("phoneNumbers")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("phoneNumbers must be a string")
    .isLength({ max: 30 })
    .withMessage("phoneNumbers length does not exceed 30 characters")
    .matches(/^(\d{8,30})(,\d{8,30}){0,2}$/) // allow three phone numbers, separates by commas
    .withMessage(
      "phoneNumbers must be between 8 and 30 digits long and can contain up to three numbers separated by commas",
    ),

  body("whatsappNumber")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("whatsappNumber must be a string")
    .matches(/^\+\d{1,3} \d{6,12}$/)
    .withMessage("whatsappNumber must be in the format (+503 12345678)")
    .customSanitizer((value) => value ?? null),

  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("email must be a valid email")
    .isLength({ max: 100 })
    .withMessage("email length does not exceed 100 characters"),

  body("address")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("address must be a string")
    .isLength({ min: 2, max: 200 })
    .withMessage("address must be between 1 and 200 characters long"),

  body("idCountry")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idCountry must be a integer between 1 and 99999999999"),

  body("idDepartment")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idDepartment must be a integer between 1 and 99999999999"),

  body("idMunicipality")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idMunicipality must be a integer between 1 and 99999999999"),
]

export const validateCustomerCreation = (): any => {
  return [...customerCommonValidations(), handleValidationErrors]
}

export const validateCustomerUpdate = (): any => {
  return [
    param("idCustomer")
      .isInt()
      .withMessage("idCustomer must be an integer")
      .customSanitizer(Number),

    ...customerCommonValidations(true),

    handleValidationErrors,
  ]
}

export const validateCustomerUpdateStatus = (): any => {
  return [
    param("idCustomer")
      .isInt()
      .withMessage("idCustomer must be an integer")
      .customSanitizer(Number),

    param("status")
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    handleValidationErrors,
  ]
}

export const validateGetCustomers = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query("name")
      .optional()
      .isString()
      .withMessage("name must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("uuid")
      .optional()
      .isString()
      .withMessage("uuid must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("dui")
      .optional()
      .isString()
      .withMessage("dui must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("nit")
      .optional()
      .isString()
      .withMessage("nit must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("nrc")
      .optional()
      .isString()
      .withMessage("nrc must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("phoneNumbers")
      .optional()
      .isString()
      .withMessage("phoneNumbers must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("whatsappNumber")
      .optional()
      .isString()
      .withMessage("whatsappNumber must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("tradeName")
      .optional()
      .isString()
      .withMessage("tradeName must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("email")
      .optional()
      .isString()
      .withMessage("email must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("idCountry")
      .optional()
      .isInt()
      .withMessage("idCountry must be a integer")
      .customSanitizer(Number),

    query("idDepartment")
      .optional()
      .isInt()
      .withMessage("idDepartment must be a integer")
      .customSanitizer(Number),

    query("idMunicipality")
      .optional()
      .isInt()
      .withMessage("idMunicipality must be a integer")
      .customSanitizer(Number),

    query("status")
      .optional()
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    handleValidationErrors,
  ]
}

export const validateGetCustomerById = (): any => {
  return [
    param("idCustomer")
      .isInt()
      .withMessage("idCustomer must be an integer")
      .customSanitizer(Number),

    handleValidationErrors,
  ]
}
