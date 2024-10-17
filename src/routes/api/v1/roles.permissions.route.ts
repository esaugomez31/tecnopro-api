import express from 'express'
import {
  rolePermissionUpdateController,
  rolePermissionGetByIdController
} from '../../../controllers/roles.permissions.controller'
import {
  validateRolePremissionUpdate,
  validateGetRolePermissionById
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = 'permissions'

// Get roles
routes.get('/:idRole', authenticationJWT, validateGetRolePermissionById(), checkPermission(page, 'view_list'), rolePermissionGetByIdController)
// Permission actions
routes.put('/update/:idRole', authenticationJWT, validateRolePremissionUpdate(), checkPermission(page, 'update'), rolePermissionUpdateController)

export default routes
