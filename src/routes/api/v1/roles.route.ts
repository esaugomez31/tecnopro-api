import express from 'express'
import {
  roleCreateController,
  roleUpdateController,
  roleGetByIdController,
  roleGetAllController
} from '../../../controllers/roles.controller'
import {
  validateRoleCreation,
  validateRoleUpdate,
  validateGetRoleById,
  validateGetRoles
} from '../../../middlewares/validations'
import {
  authenticationJWT
} from '../../../middlewares'

const routes = express.Router()

// Get roles
routes.get('/', authenticationJWT, validateGetRoles(), roleGetAllController)
routes.get('/:idRole', authenticationJWT, validateGetRoleById(), roleGetByIdController)

// Role actions
routes.post('/register', authenticationJWT, validateRoleCreation(), roleCreateController)
routes.put('/update/:idRole', authenticationJWT, validateRoleUpdate(), roleUpdateController)

export default routes
