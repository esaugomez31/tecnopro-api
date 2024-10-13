import express from 'express'
import {
  userLoginController,
  userCreateController,
  userUpdateController,
  userLogoutController,
  userGetAll,
  userGetById
} from '../../../controllers/users.controller'
import {
  validateUserCreation,
  validateUserUpdate,
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

// Get users
routes.get('/', authenticationJWT, validateGetUsers(), userGetAll)
routes.get('/:idUser', authenticationJWT, validateGetById(), userGetById)

// User actions
routes.post('/register', authenticationJWT, validateUserCreation(), userCreateController)
routes.put('/update/:idUser', authenticationJWT, validateUserUpdate(), userUpdateController)

export default routes
