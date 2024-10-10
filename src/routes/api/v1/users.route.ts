import express, { RequestHandler } from 'express'
import { userLoginController } from '../../../controllers/users.controller'

const routes = express.Router()

routes.post('/register')
routes.post('/login', userLoginController as RequestHandler)
routes.post('/logout')

export default routes
