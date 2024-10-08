import express from 'express'
import authentication from './users.route'

const routes = express.Router()

routes.use('/users', authentication)

export default routes
