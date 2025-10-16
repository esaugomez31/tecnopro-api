import express from "express"

import {
  brandCreateController,
  brandUpdateController,
  brandGetByIdController,
  brandGetAllController,
  brandUpdateStatusController,
} from "../../../controllers/brands.controller"
import { BrandPermEnum, SystemPageEnum } from "../../../interfaces"
import {
  validateBrandCreation,
  validateBrandUpdate,
  validateGetBrandById,
  validateGetBrands,
  validateBrandUpdateStatus,
} from "../../../middlewares/validations"
import { authenticationJWT, checkPermission } from "../../../middlewares"

const routes = express.Router()
const page = SystemPageEnum.BRANDS

// Get brands
routes.get(
  "/",
  authenticationJWT,
  validateGetBrands(),
  checkPermission(page, BrandPermEnum.VIEWLIST),
  brandGetAllController,
)
routes.get(
  "/:idBrand",
  authenticationJWT,
  validateGetBrandById(),
  checkPermission(page, BrandPermEnum.VIEWLIST),
  brandGetByIdController,
)

// Brand actions
routes.post(
  "/register",
  authenticationJWT,
  validateBrandCreation(),
  checkPermission(page, BrandPermEnum.CREATE),
  brandCreateController,
)
routes.put(
  "/update/:idBrand",
  authenticationJWT,
  validateBrandUpdate(),
  checkPermission(page, BrandPermEnum.UPDATE),
  brandUpdateController,
)
routes.put(
  "/:idBrand/status/:status",
  authenticationJWT,
  validateBrandUpdateStatus(),
  checkPermission(page, BrandPermEnum.UPDATESTATUS),
  brandUpdateStatusController,
)

export default routes
