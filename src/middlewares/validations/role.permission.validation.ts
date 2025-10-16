import { body, param, type ValidationChain } from "express-validator"

import { handleValidationErrors } from "../../helpers"

import { ValidationList } from "./types"

const roleCommonValidations = (): ValidationChain[] => [
  body("permissions").isArray().withMessage("permissions must be an array"),
  body("permissions.*.idPermission")
    .isInt()
    .withMessage("idPermission must be an integer"),
]

export const validateRolePremissionUpdate = (): ValidationList => {
  return [
    param("idRole")
      .isInt()
      .withMessage("idRole must be an integer")
      .customSanitizer(Number),

    ...roleCommonValidations(),

    handleValidationErrors,
  ]
}

export const validateGetRolePermissionById = (): ValidationList => {
  return [
    param("idRole")
      .isInt()
      .withMessage("idRole must be an integer")
      .customSanitizer(Number),

    handleValidationErrors,
  ]
}
