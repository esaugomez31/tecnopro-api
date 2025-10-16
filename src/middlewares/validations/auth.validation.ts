import { body } from "express-validator"

import { handleValidationErrors } from "../../helpers"

export const validateLogin = (): any => {
  return [
    body("usernameOrEmail")
      .isString()
      .withMessage("usernameOrEmail must be a string")
      .notEmpty()
      .withMessage("usernameOrEmail is required"),

    body("password")
      .isString()
      .withMessage("password must be a string")
      .notEmpty()
      .withMessage("password is required"),

    handleValidationErrors,
  ]
}
