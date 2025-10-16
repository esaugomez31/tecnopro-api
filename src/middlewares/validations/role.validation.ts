import { body, query, param, type ValidationChain } from "express-validator"

import { handleValidationErrors, stringToBoolean } from "../../helpers"

import { validateFilterParams } from "./filter.validation"
import { ValidationList } from "./types"

const validSortFields = ["idRole", "name"]

const roleCommonValidations = (optional = false): ValidationChain[] => [
  body("name")
    .optional(optional)
    .isString()
    .withMessage("name must be a string")
    .isLength({ min: 8, max: 25 })
    .withMessage("name must be between 8 and 20 characters long"),

  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 250 })
    .withMessage("description must have a maximum of 250 characters"),
]

export const validateRoleCreation = (): ValidationList => {
  return [...roleCommonValidations(), handleValidationErrors]
}

export const validateRoleUpdate = (): ValidationList => {
  return [
    param("idRole")
      .isInt()
      .withMessage("idRole must be an integer")
      .customSanitizer(Number),

    ...roleCommonValidations(true),

    handleValidationErrors,
  ]
}

export const validateRoleUpdateStatus = (): ValidationList => {
  return [
    param("idRole")
      .isInt()
      .withMessage("idRole must be an integer")
      .customSanitizer(Number),

    param("status")
      .isBoolean()
      .withMessage("status must be a boolean")
      .customSanitizer(stringToBoolean),

    handleValidationErrors,
  ]
}

export const validateGetRoles = (): ValidationList => {
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

    handleValidationErrors,
  ]
}

export const validateGetRoleById = (): ValidationList => {
  return [
    param("idRole")
      .isInt()
      .withMessage("idRole must be an integer")
      .customSanitizer(Number),

    handleValidationErrors,
  ]
}
