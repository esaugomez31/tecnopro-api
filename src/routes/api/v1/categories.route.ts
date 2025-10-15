import express from 'express'

import {
  categoryCreateController,
  categoryUpdateController,
  categoryGetByIdController,
  categoryGetAllController,
  categoryUpdateStatusController
} from '../../../controllers/categories.controller'
import { CategoryPermEnum, SystemPageEnum } from '../../../interfaces'
import {
  validateCategoryCreation,
  validateCategoryUpdate,
  validateGetCategoryById,
  validateGetCategories,
  validateCategoryUpdateStatus
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()
const page = SystemPageEnum.CATEGORIES

// Get categories
routes.get('/', authenticationJWT, validateGetCategories(), checkPermission(page, CategoryPermEnum.VIEWLIST), categoryGetAllController)
routes.get('/:idCategory', authenticationJWT, validateGetCategoryById(), checkPermission(page, CategoryPermEnum.VIEWLIST), categoryGetByIdController)

// Category actions
routes.post('/register', authenticationJWT, validateCategoryCreation(), checkPermission(page, CategoryPermEnum.CREATE), categoryCreateController)
routes.put('/update/:idCategory', authenticationJWT, validateCategoryUpdate(), checkPermission(page, CategoryPermEnum.UPDATE), categoryUpdateController)
routes.put('/:idCategory/status/:status', authenticationJWT, validateCategoryUpdateStatus(), checkPermission(page, CategoryPermEnum.UPDATESTATUS), categoryUpdateStatusController)

export default routes
