
import express from 'express'
import {
  refreshTokenController,
  loginController,
  logoutController
} from '../../../controllers/auth.controller'
import {
  authenticationJWT,
  validateLogin
} from '../../../middlewares'

const routes = express.Router()

// Authentication
routes.post('/login', validateLogin(), loginController)
routes.post('/logout', authenticationJWT, logoutController)
routes.post('/refresh-token', refreshTokenController)

export default routes
