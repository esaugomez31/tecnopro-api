import express from 'express'
import {
  rolePermissionUpdateController
} from '../../../controllers/roles.permissions.controller'
import {
  validateRolePremissionUpdate
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = 'permissions'

// Permission actions
routes.put('/update/:idRole', authenticationJWT, validateRolePremissionUpdate(), checkPermission(page, 'update'), rolePermissionUpdateController)

export default routes
