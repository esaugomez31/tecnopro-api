import { body, param } from 'express-validator'
import { handleValidationErrors } from '../../helpers'

const roleCommonValidations = (): any => [
  body('permissions').isArray().withMessage('permissions must be an array'),
  body('permissions.*.idPermission').isInt().withMessage('idPermission must be an integer')
]

export const validateRolePremissionUpdate = (): any => {
  return [
    param('idRole')
      .isInt().withMessage('idRole must be an integer')
      .customSanitizer(Number),

    ...roleCommonValidations(),

    handleValidationErrors
  ]
}

export const validateGetRolePermissionById = (): any => {
  return [
    param('idRole')
      .isInt().withMessage('idRole must be an integer')
      .customSanitizer(Number),

    handleValidationErrors
  ]
}
