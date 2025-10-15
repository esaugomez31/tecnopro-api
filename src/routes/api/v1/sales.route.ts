import express from 'express'

import {
  saleCreateController,
  saleGetByIdController,
  saleGetAllController,
  saleUpdateStatusController
} from '../../../controllers/sales.controller'
import { SalePermEnum, SystemPageEnum } from '../../../interfaces'
import {
  validateSaleCreation,
  validateGetSaleById,
  validateGetSales,
  validateSaleUpdateStatus
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = SystemPageEnum.SALES

// Get sales
routes.get('/', authenticationJWT, validateGetSales(), checkPermission(page, SalePermEnum.VIEWLIST), saleGetAllController)
routes.get('/:idSale', authenticationJWT, validateGetSaleById(), checkPermission(page, SalePermEnum.VIEWLIST), saleGetByIdController)

// Sale actions
routes.post('/register', authenticationJWT, validateSaleCreation(), checkPermission(page, SalePermEnum.CREATE), saleCreateController)
routes.put('/:idSale/status/:status', authenticationJWT, validateSaleUpdateStatus(), checkPermission(page, SalePermEnum.UPDATESTATUS), saleUpdateStatusController)

export default routes
