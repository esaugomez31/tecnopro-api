import express from 'express'

import {
  productCreateController,
  productUpdateController,
  productGetByIdController,
  productGetAllController,
  productUpdateStatusController
} from '../../../controllers/products.controller'
import { ProductPermEnum, SystemPageEnum } from '../../../interfaces'
import {
  validateProductCreation,
  validateProductUpdate,
  validateGetProductById,
  validateGetProducts,
  validateProductUpdateStatus
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = SystemPageEnum.PRODUCTS

// Get products
routes.get('/', authenticationJWT, validateGetProducts(), checkPermission(page, ProductPermEnum.VIEWLIST), productGetAllController)
routes.get('/:idProduct', authenticationJWT, validateGetProductById(), checkPermission(page, ProductPermEnum.VIEWLIST), productGetByIdController)

// Product actions
routes.post('/register', authenticationJWT, validateProductCreation(), checkPermission(page, ProductPermEnum.CREATE), productCreateController)
routes.put('/update/:idProduct', authenticationJWT, validateProductUpdate(), checkPermission(page, ProductPermEnum.UPDATE), productUpdateController)
routes.put('/:idProduct/status/:status', authenticationJWT, validateProductUpdateStatus(), checkPermission(page, ProductPermEnum.UPDATESTATUS), productUpdateStatusController)

export default routes
