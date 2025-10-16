import express from "express"

import {
  customerCreateController,
  customerUpdateController,
  customerGetByIdController,
  customerGetAllController,
  customerUpdateStatusController,
} from "../../../controllers/customers.controller"
import { CustomerPermEnum, SystemPageEnum } from "../../../interfaces"
import {
  validateCustomerCreation,
  validateCustomerUpdate,
  validateGetCustomerById,
  validateGetCustomers,
  validateCustomerUpdateStatus,
} from "../../../middlewares/validations"
import { authenticationJWT, checkPermission } from "../../../middlewares"

const routes = express.Router()
const page = SystemPageEnum.CUSTOMERS

// Get customers
routes.get("/", authenticationJWT, validateGetCustomers(), customerGetAllController)
routes.get(
  "/:idCustomer",
  authenticationJWT,
  validateGetCustomerById(),
  customerGetByIdController,
)

// Customer actions
routes.post(
  "/register",
  authenticationJWT,
  validateCustomerCreation(),
  checkPermission(page, CustomerPermEnum.CREATE),
  customerCreateController,
)
routes.put(
  "/update/:idCustomer",
  authenticationJWT,
  validateCustomerUpdate(),
  checkPermission(page, CustomerPermEnum.UPDATE),
  customerUpdateController,
)
routes.put(
  "/:idCustomer/status/:status",
  authenticationJWT,
  validateCustomerUpdateStatus(),
  checkPermission(page, CustomerPermEnum.UPDATESTATUS),
  customerUpdateStatusController,
)

export default routes
