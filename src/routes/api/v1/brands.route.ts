import express from 'express'
import {
  brandCreateController,
  brandUpdateController,
  brandGetByIdController,
  brandGetAllController,
  brandUpdateStatusController
} from '../../../controllers/brands.controller'
import {
  validateBrandCreation,
  validateBrandUpdate,
  validateGetBrandById,
  validateGetBrands,
  validateBrandUpdateStatus
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = 'brands'

// Get brands
routes.get('/', authenticationJWT, validateGetBrands(), checkPermission(page, 'view_list'), brandGetAllController)
routes.get('/:idBrand', authenticationJWT, validateGetBrandById(), checkPermission(page, 'view_list'), brandGetByIdController)

// Brand actions
routes.post('/register', authenticationJWT, validateBrandCreation(), checkPermission(page, 'create'), brandCreateController)
routes.put('/update/:idBrand', authenticationJWT, validateBrandUpdate(), checkPermission(page, 'update'), brandUpdateController)
routes.put('/:idBrand/status/:status', authenticationJWT, validateBrandUpdateStatus(), checkPermission(page, 'update_status'), brandUpdateStatusController)

export default routes
