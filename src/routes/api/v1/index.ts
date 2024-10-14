import express from 'express'
import userRoutes from './users.route'
import roleRoutes from './roles.route'

const routes = express.Router()

routes.use('/users', userRoutes)
routes.use('/roles', roleRoutes)

export default routes
