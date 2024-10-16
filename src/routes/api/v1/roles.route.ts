import express from 'express'
import {
  roleCreateController,
  roleUpdateController,
  roleGetByIdController,
  roleGetAllController,
  roleUpdateStatusController
} from '../../../controllers/roles.controller'
import {
  validateRoleCreation,
  validateRoleUpdate,
  validateGetRoleById,
  validateGetRoles,
  validateRoleUpdateStatus
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = 'roles'

// Get roles
routes.get('/', authenticationJWT, validateGetRoles(), checkPermission(page, 'view_list'), roleGetAllController)
routes.get('/:idRole', authenticationJWT, validateGetRoleById(), checkPermission(page, 'view_list'), roleGetByIdController)

// Role actions
routes.post('/register', authenticationJWT, validateRoleCreation(), checkPermission(page, 'create'), roleCreateController)
routes.put('/update/:idRole', authenticationJWT, validateRoleUpdate(), checkPermission(page, 'update'), roleUpdateController)
routes.put('/:idRole/status/:status', authenticationJWT, validateRoleUpdateStatus(), checkPermission(page, 'update_status'), roleUpdateStatusController)

export default routes
