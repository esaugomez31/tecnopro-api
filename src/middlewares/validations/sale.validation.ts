import { body, query, param } from "express-validator"

import { handleValidationErrors, stringToBoolean } from "../../helpers"

import { validateFilterParams, validateIncludeParams } from "./filter.validation"

const validSortFields = [
  "idSale",
  "total",
  "vat",
  "totalProfit",
  "grossProfit",
  "usersCommission",
  "refunded",
]
const validDteOperationCondition = ["1", "2", "3"]
const validIncludeFields = ["user", "customer", "branch", "saleDetails"]

const saleCommonValidations = (optional = false): any => [
  body("idBranch")
    .optional(optional)
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idBranch must be a integer between 1 and 99999999999"),

  body("idCustomer")
    .optional()
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idCustomer must be a integer between 1 and 99999999999"),

  body("invoiceType")
    .optional(optional)
    .isString()
    .isLength({ max: 25 })
    .withMessage("invoiceType must be a string with a maximum length of 25 characters"),

  body("paid")
    .optional(optional)
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("paid must be a decimal number with 2 decimal places"),

  body("shippingCost")
    .optional(optional)
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("shippingCost must be a decimal number with 2 decimal places"),

  body("customerNotes")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ max: 255 })
    .withMessage(
      "customerNotes must be a string with a maximum length of 255 characters",
    ),

  body("contingencyStatus")
    .optional()
    .isBoolean()
    .withMessage("contingencyStatus must be a boolean")
    .customSanitizer(stringToBoolean),

  body("products")
    .isArray()
    .withMessage("products must be an array")
    .bail()
    .custom((value) => value.length > 0)
    .withMessage("products must contain at least one product"),

  body("products.*.idProduct")
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("products.*.idProduct must be a integer between 1 and 99999999999"),

  body("products.*.price")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("products.*.price must be a decimal number with 2 decimal places")
    .toFloat(),

  body("products.*.quantity")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("products.*.quantity must be a decimal number with 2 decimal places")
    .toFloat(),

  // ########################################### DTE START ###########################################

  /* body('dte')
    .optional({ checkFalsy: true }), */

  body("dteOperationCondition")
    .optional()
    .isIn(validDteOperationCondition)
    .withMessage(
      `dteOperationCondition must be one of the following: ${validDteOperationCondition.join(", ")}.`,
    )
    .customSanitizer((value) => value as string),
]

export const validateSaleCreation = (): any => {
  return [...saleCommonValidations(), handleValidationErrors]
}

export const validateSaleUpdateStatus = (): any => {
  return [
    param("idSale")
      .isInt()
      .withMessage("idSale must be an integer")
      .customSanitizer(Number),

    param("status")
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    handleValidationErrors,
  ]
}

export const validateGetSales = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query("uuid")
      .optional()
      .isString()
      .withMessage("uuid must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("idUser")
      .optional()
      .isInt()
      .withMessage("idUser must be a integer")
      .customSanitizer(Number),

    query("idCustomer")
      .optional()
      .isInt()
      .withMessage("idCustomer must be a integer")
      .customSanitizer(Number),

    query("idBranch")
      .optional()
      .isInt()
      .withMessage("idBranch must be a integer")
      .customSanitizer(Number),

    query("startDate")
      .optional()
      .isISO8601()
      .withMessage("startDate must be a valid date in ISO8601 format")
      .toDate(),

    query("endDate")
      .optional()
      .isISO8601()
      .withMessage("endDate must be a valid date in ISO8601 format")
      .toDate(),

    query("status")
      .optional()
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    ...validateIncludeParams(validIncludeFields),

    handleValidationErrors,
  ]
}

export const validateGetSaleById = (): any => {
  return [
    param("idSale")
      .isInt()
      .withMessage("idSale must be an integer")
      .customSanitizer(Number),

    ...validateIncludeParams(validIncludeFields),

    handleValidationErrors,
  ]
}
