import express from 'express'
import {
  userLoginController,
  userCreateController,
  userLogoutController
} from '../../../controllers/users.controller'
import {
  validateUserCreation,
  validateUserLogin
} from '../../../controllers/validations'
import { authenticationJWT } from '../../../middlewares/authenticationjwt'

const routes = express.Router()

routes.post('/login', validateUserLogin(), userLoginController)
routes.post('/logout', authenticationJWT, userLogoutController)
routes.post('/register', authenticationJWT, validateUserCreation(), userCreateController)

export default routes
