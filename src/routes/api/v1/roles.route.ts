import express from 'express'

import {
  roleCreateController,
  roleUpdateController,
  roleGetByIdController,
  roleGetAllController,
  roleUpdateStatusController
} from '../../../controllers/roles.controller'
import { RolePermEnum, SystemPageEnum } from '../../../interfaces'
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
const page = SystemPageEnum.ROLES

// Get roles
routes.get('/', authenticationJWT, validateGetRoles(), checkPermission(page, RolePermEnum.VIEWLIST), roleGetAllController)
routes.get('/:idRole', authenticationJWT, validateGetRoleById(), checkPermission(page, RolePermEnum.VIEWLIST), roleGetByIdController)

// Role actions
routes.post('/register', authenticationJWT, validateRoleCreation(), checkPermission(page, RolePermEnum.CREATE), roleCreateController)
routes.put('/update/:idRole', authenticationJWT, validateRoleUpdate(), checkPermission(page, RolePermEnum.UPDATE), roleUpdateController)
routes.put('/:idRole/status/:status', authenticationJWT, validateRoleUpdateStatus(), checkPermission(page, RolePermEnum.UPDATESTATUS), roleUpdateStatusController)

export default routes
