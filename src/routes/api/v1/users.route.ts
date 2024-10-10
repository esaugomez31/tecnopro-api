import express, { RequestHandler } from 'express'
import { userController } from '../../../controllers'

const routes = express.Router()

routes.post('/register')
routes.post('/login', userController as RequestHandler)
routes.post('/logout')

export default routes
