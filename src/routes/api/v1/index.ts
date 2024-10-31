import express from 'express'
import userRoutes from './users.route'
import roleRoutes from './roles.route'
import brandRoutes from './brands.route'
import countryRoutes from './countries.route'
import departmentRoutes from './departments.route'
import municipalityRoutes from './municipalities.route'
import categoryRoutes from './categories.route'
import rolesPermissionRoutes from './roles.permissions.route'

const routes = express.Router()

routes.use('/users', userRoutes)

routes.use('/roles', roleRoutes)
routes.use('/roles-permissions', rolesPermissionRoutes)

routes.use('/countries', countryRoutes)
routes.use('/departments', departmentRoutes)
routes.use('/municipalities', municipalityRoutes)

routes.use('/categories', categoryRoutes)
routes.use('/brands', brandRoutes)

export default routes
