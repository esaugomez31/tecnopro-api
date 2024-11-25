
import express from 'express'
import {
  refreshTokenController,
  loginController,
  logoutController
} from '../../../controllers/auth.controller'
import {
  authenticationJWT,
  verifyRecaptcha,
  validateLogin
} from '../../../middlewares'

const routes = express.Router()

// Authentication
routes.post('/login', validateLogin(), verifyRecaptcha, loginController)
routes.post('/logout', authenticationJWT, logoutController)
routes.post('/refresh-token', refreshTokenController)

export default routes
