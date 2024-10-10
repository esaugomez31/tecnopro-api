import express, { RequestHandler } from 'express'
import {
  userLoginController,
  userCreateController
} from '../../../controllers/users.controller'
import {
  validateUserCreation
} from '../../../controllers/validations'

const routes = express.Router()

routes.post('/register', validateUserCreation(), userCreateController as RequestHandler)
routes.post('/login', userLoginController as RequestHandler)
routes.post('/logout')

export default routes
