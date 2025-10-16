import { body, query, param } from "express-validator"

import { handleValidationErrors, stringToBoolean } from "../../helpers"

import { validateFilterParams } from "./filter.validation"

const validSortFields = [
  "idProduct",
  "name",
  "location",
  "price",
  "stock",
  "userCommissionPercent",
  "branchCommissionPercent",
]
const purchasedBy = ["store", "user"]

const productCommonValidations = (optional = false): any => [
  body("name")
    .optional(optional)
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 1, max: 50 })
    .withMessage("name must be between 1 and 50 characters long"),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("description must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("description must be between 1 and 100 characters long"),

  body("location")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("location must be a string")
    .isLength({ min: 1, max: 50 })
    .withMessage("location must be between 1 and 50 characters long"),

  body("code")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("code must be a string")
    .isLength({ min: 1, max: 20 })
    .withMessage("code must be between 1 and 20 characters long"),

  body("barcode")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("barcode must be a string")
    .isLength({ min: 1, max: 30 })
    .withMessage("barcode must be between 1 and 30 characters long"),

  body("barcodeGenerated")
    .optional()
    .isBoolean()
    .withMessage("barcodeGenerated must be a boolean")
    .customSanitizer(stringToBoolean),

  body("price")
    .optional(optional)
    .isDecimal({ decimal_digits: "0,4" })
    .withMessage("price must be a decimal with up to 4 decimal places")
    .custom((value) => value > 0)
    .withMessage("price must be greater than 0"),

  body("purchasePrice")
    .optional()
    .isDecimal({ decimal_digits: "0,4" })
    .withMessage("purchasePrice must be a decimal with up to 4 decimal places")
    .custom((value) => value > 0)
    .withMessage("purchasePrice must be greater than 0"),

  body("purchasedBy")
    .optional()
    .isIn(purchasedBy)
    .withMessage(`orderBy must be one of the following: ${purchasedBy.join(", ")}.`)
    .customSanitizer((value) => value as string),

  body("dteUnitMeasure")
    .optional()
    .isInt({ min: 0, max: 99 })
    .withMessage("dteUnitMeasure must be an integer between 0 and 99 digits")
    .customSanitizer(Number),

  body("userCommissionPercent")
    .optional()
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("userCommissionPercent must be a decimal with up to 2 decimal places")
    .custom((value: number, { req }) => {
      const branchCommision: number = req.body?.branchCommissionPercent ?? 0.0

      if (value + branchCommision !== 100.0) {
        throw new Error(
          "The sum of userCommissionPercent and branchCommissionPercent must equal 100.00",
        )
      }

      return true
    }),

  body("branchCommissionPercent")
    .optional()
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("branchCommissionPercent must be a decimal with up to 2 decimal places")
    .custom((value: number, { req }) => {
      const userCommision: number = req.body?.userCommissionPercent ?? 0.0

      if (value + userCommision !== 100.0) {
        throw new Error(
          "The sum of userCommissionPercent and branchCommissionPercent must equal 100.00",
        )
      }

      return true
    }),

  body("minPrice")
    .optional()
    .isDecimal({ decimal_digits: "0,4" })
    .withMessage("minPrice must be a decimal with up to 4 decimal places")
    .custom((value) => value > 0)
    .withMessage("minPrice must be greater than 0"),

  body("stock")
    .optional(optional)
    .isDecimal({ decimal_digits: "0,4" })
    .withMessage("stock must be a decimal with up to 4 decimal places")
    .custom((value) => value > 0)
    .withMessage("stock must be greater than 0"),

  body("imageUrl")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("imageUrl must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("imageUrl must be between 1 and 100 characters long"),

  body("idBranch")
    .optional(optional)
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idBranch must be an integer")
    .customSanitizer(Number),

  body("idBrand")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idBrand must be an integer")
    .customSanitizer(Number),

  body("idCategory")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idCategory must be an integer")
    .customSanitizer(Number),

  body("idUser")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 99999999999 })
    .withMessage("idUser must be an integer")
    .customSanitizer(Number),
]

export const validateProductCreation = (): any => {
  return [...productCommonValidations(), handleValidationErrors]
}

export const validateProductUpdate = (): any => {
  return [
    param("idProduct")
      .isInt()
      .withMessage("idProduct must be an integer")
      .customSanitizer(Number),

    ...productCommonValidations(true),

    handleValidationErrors,
  ]
}

export const validateProductUpdateStatus = (): any => {
  return [
    param("idProduct")
      .isInt()
      .withMessage("idProduct must be an integer")
      .customSanitizer(Number),

    param("status")
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    handleValidationErrors,
  ]
}

export const validateGetProducts = (): any => {
  return [
    ...validateFilterParams(validSortFields),

    query("name")
      .optional()
      .isString()
      .withMessage("name must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("status")
      .optional()
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    query("description")
      .optional()
      .isString()
      .withMessage("description must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("uuid")
      .optional()
      .isString()
      .withMessage("uuid must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("location")
      .optional()
      .isString()
      .withMessage("location must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("code")
      .optional()
      .isString()
      .withMessage("code must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("barcode")
      .optional()
      .isString()
      .withMessage("barcode must be a string")
      .customSanitizer((value) => value as string | undefined),

    query("idBranch")
      .optional()
      .isInt()
      .withMessage("idBranch must be a string")
      .customSanitizer((value) => value as number | undefined),

    query("idCategory")
      .optional()
      .isInt()
      .withMessage("idCategory must be a string")
      .customSanitizer((value) => value as number | undefined),

    query("idBrand")
      .optional()
      .isInt()
      .withMessage("idBrand must be a string")
      .customSanitizer((value) => value as number | undefined),

    query("idUser")
      .optional()
      .isInt()
      .withMessage("idUser must be a string")
      .customSanitizer((value) => value as number | undefined),

    handleValidationErrors,
  ]
}

export const validateGetProductById = (): any => {
  return [
    param("idProduct")
      .isInt()
      .withMessage("idProduct must be an integer")
      .customSanitizer(Number),

    handleValidationErrors,
  ]
}
