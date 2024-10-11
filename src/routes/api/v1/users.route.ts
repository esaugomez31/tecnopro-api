import express from 'express'
import {
  userLoginController,
  userCreateController
} from '../../../controllers/users.controller'
import {
  validateUserCreation,
  validateUserLogin
} from '../../../controllers/validations'
import { authenticationJWT } from '../../../middlewares/authenticationjwt'

const routes = express.Router()

routes.post('/register', authenticationJWT, validateUserCreation(), userCreateController)
routes.post('/login', validateUserLogin(), userLoginController)
routes.post('/logout')

export default routes
