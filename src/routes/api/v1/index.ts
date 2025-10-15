import express from "express"

import authRoutes from "./auth.route"
import userRoutes from "./users.route"
import roleRoutes from "./roles.route"
import brandRoutes from "./brands.route"
import locationRoutes from "./locations"
import saleRoutes from "./sales.route"
import productRoutes from "./products.route"
import categoryRoutes from "./categories.route"
import customerRoutes from "./customers.route"
import branchesRoutes from "./branches.route"
import rolesPermissionRoutes from "./roles.permissions.route"

const routes = express.Router()

routes.use("/auth", authRoutes)

routes.use("/users", userRoutes)

routes.use("/roles", roleRoutes)
routes.use("/roles-permissions", rolesPermissionRoutes)

routes.use("/locations", locationRoutes)

routes.use("/branches", branchesRoutes)

routes.use("/sales", saleRoutes)

routes.use("/products", productRoutes)
routes.use("/categories", categoryRoutes)
routes.use("/brands", brandRoutes)

routes.use("/customers", customerRoutes)

export default routes
