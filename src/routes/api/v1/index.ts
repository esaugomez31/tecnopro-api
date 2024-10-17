import express from 'express'
import userRoutes from './users.route'
import roleRoutes from './roles.route'
import rolesPermissionRoutes from './roles.permissions.route'

const routes = express.Router()

routes.use('/users', userRoutes)
routes.use('/roles', roleRoutes)
routes.use('/roles-permissions', rolesPermissionRoutes)

export default routes
