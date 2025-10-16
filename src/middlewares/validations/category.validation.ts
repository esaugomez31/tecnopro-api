import { body, query, param, type ValidationChain } from "express-validator"

import { handleValidationErrors, stringToBoolean } from "../../helpers"

import { validateFilterParams } from "./filter.validation"
import { ValidationList } from "./types"

const validSortFields = ["idCategory", "name", "description"]

const categoryCommonValidations = (optional = false): ValidationChain[] => [
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
    .isLength({ max: 250 })
    .withMessage("description must have a maximum of 250 characters"),
]

export const validateCategoryCreation = (): ValidationList => {
  return [...categoryCommonValidations(), handleValidationErrors]
}

export const validateCategoryUpdate = (): ValidationList => {
  return [
    param("idCategory")
      .isInt()
      .withMessage("idCategory must be an integer")
      .customSanitizer(Number),

    ...categoryCommonValidations(true),

    handleValidationErrors,
  ]
}

export const validateCategoryUpdateStatus = (): ValidationList => {
  return [
    param("idCategory")
      .isInt()
      .withMessage("idCategory must be an integer")
      .customSanitizer(Number),

    param("status")
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    handleValidationErrors,
  ]
}

export const validateGetCategories = (): ValidationList => {
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

    handleValidationErrors,
  ]
}

export const validateGetCategoryById = (): ValidationList => {
  return [
    param("idCategory")
      .isInt()
      .withMessage("idCategory must be an integer")
      .customSanitizer(Number),

    handleValidationErrors,
  ]
}
