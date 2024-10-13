import express from 'express'
import {
  userLoginController,
  userCreateController,
  userLogoutController,
  userGetAll,
  userGetById
} from '../../../controllers/users.controller'
import {
  validateUserCreation,
  validateUserLogin,
  validateGetUsers,
  validateGetById
} from '../../../middlewares/validations'
import {
  authenticationJWT
} from '../../../middlewares/authenticationjwt'

const routes = express.Router()

// Authentication
routes.post('/login', validateUserLogin(), userLoginController)
routes.post('/logout', authenticationJWT, userLogoutController)
routes.post('/register', authenticationJWT, validateUserCreation(), userCreateController)

// Get users
routes.get('/', authenticationJWT, validateGetUsers(), userGetAll)
routes.get('/:idUser', authenticationJWT, validateGetById(), userGetById)

export default routes
