import express, { RequestHandler } from 'express'
import { body } from 'express-validator'
import {
  userLoginController,
  userCreateController
} from '../../../controllers/users.controller'
import {
  validateUserCreation
} from '../../../controllers/validations'

const routes = express.Router()

routes.post('/register', body('email2').isInt(), validateUserCreation, userCreateController as RequestHandler)
routes.post('/login', userLoginController as RequestHandler)
routes.post('/logout')

export default routes
