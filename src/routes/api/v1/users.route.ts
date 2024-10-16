import express from 'express'
import {
  userLoginController,
  userSignupController,
  userUpdateController,
  userLogoutController,
  userGetAllController,
  userGetByIdController,
  userUpdateStatusController
} from '../../../controllers/users.controller'
import {
  validateUserSignup,
  validateUserUpdate,
  validateUserLogin,
  validateGetUsers,
  validateGetUserById,
  validateUserUpdateStatus
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = 'users'

// Authentication
routes.post('/login', validateUserLogin(), userLoginController)
routes.post('/logout', authenticationJWT, userLogoutController)

// Get users
routes.get('/', authenticationJWT, validateGetUsers(), checkPermission(page, 'view_list'), userGetAllController)
routes.get('/:idUser', authenticationJWT, validateGetUserById(), checkPermission(page, 'view_list'), userGetByIdController)

// User actions
routes.post('/signup', authenticationJWT, validateUserSignup(), checkPermission(page, 'create'), userSignupController)
routes.put('/update/:idUser', authenticationJWT, validateUserUpdate(), checkPermission(page, 'update'), userUpdateController)
routes.put('/:idUser/status/:status', authenticationJWT, validateUserUpdateStatus(), checkPermission(page, 'update_status'), userUpdateStatusController)

export default routes
