import express from 'express'

import {
  rolePermissionUpdateController,
  rolePermissionGetByIdController
} from '../../../controllers/roles.permissions.controller'
import { PermissionPermEnum, SystemPageEnum } from '../../../interfaces'
import {
  validateRolePremissionUpdate,
  validateGetRolePermissionById
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = SystemPageEnum.PERMISSIONS

// Get roles
routes.get('/:idRole', authenticationJWT, validateGetRolePermissionById(), checkPermission(page, PermissionPermEnum.VIEWLIST), rolePermissionGetByIdController)
// Permission actions
routes.put('/update/:idRole', authenticationJWT, validateRolePremissionUpdate(), checkPermission(page, PermissionPermEnum.UPDATE), rolePermissionUpdateController)

export default routes
