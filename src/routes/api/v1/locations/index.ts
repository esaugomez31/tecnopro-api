import express from "express"

import countryRoutes from "./countries.route"
import departmentRoutes from "./departments.route"
import municipalityRoutes from "./municipalities.route"

const routes = express.Router()

routes.use("/countries", countryRoutes)
routes.use("/departments", departmentRoutes)
routes.use("/municipalities", municipalityRoutes)

export default routes
