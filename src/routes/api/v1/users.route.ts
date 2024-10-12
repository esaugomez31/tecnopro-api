import express from 'express'
import {
  userLoginController,
  userCreateController,
  userLogoutController,
  userGetAll
} from '../../../controllers/users.controller'
import {
  validateUserCreation,
  validateUserLogin,
  validateGetUsers
} from '../../../controllers/validations'
import { authenticationJWT } from '../../../middlewares/authenticationjwt'

const routes = express.Router()

// Authentication
routes.post('/login', validateUserLogin(), userLoginController)
routes.post('/logout', authenticationJWT, userLogoutController)
routes.post('/register', authenticationJWT, validateUserCreation(), userCreateController)

// Get all users
routes.get('/', authenticationJWT, validateGetUsers(), userGetAll)

export default routes
