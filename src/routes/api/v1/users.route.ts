import express from 'express'
import {
  userLoginController,
  userCreateController,
  userUpdateController,
  userLogoutController,
  userGetAllController,
  userGetByIdController
} from '../../../controllers/users.controller'
import {
  validateUserCreation,
  validateUserUpdate,
  validateUserLogin,
  validateGetUsers,
  validateGetUserById
} from '../../../middlewares/validations'
import {
  authenticationJWT
} from '../../../middlewares/authenticationjwt'

const routes = express.Router()

// Authentication
routes.post('/login', validateUserLogin(), userLoginController)
routes.post('/logout', authenticationJWT, userLogoutController)

// Get users
routes.get('/', authenticationJWT, validateGetUsers(), userGetAllController)
routes.get('/:idUser', authenticationJWT, validateGetUserById(), userGetByIdController)

// User actions
routes.post('/register', authenticationJWT, validateUserCreation(), userCreateController)
routes.put('/update/:idUser', authenticationJWT, validateUserUpdate(), userUpdateController)

export default routes
