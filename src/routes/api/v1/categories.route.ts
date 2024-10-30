import express from 'express'
import {
  categoryCreateController,
  categoryUpdateController,
  categoryGetByIdController,
  categoryGetAllController,
  categoryUpdateStatusController
} from '../../../controllers/categories.controller'
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
const page = 'categories'

// Get categories
routes.get('/', authenticationJWT, validateGetCategories(), checkPermission(page, 'view_list'), categoryGetAllController)
routes.get('/:idCategory', authenticationJWT, validateGetCategoryById(), checkPermission(page, 'view_list'), categoryGetByIdController)

// Category actions
routes.post('/register', authenticationJWT, validateCategoryCreation(), checkPermission(page, 'create'), categoryCreateController)
routes.put('/update/:idCategory', authenticationJWT, validateCategoryUpdate(), checkPermission(page, 'update'), categoryUpdateController)
routes.put('/:idCategory/status/:status', authenticationJWT, validateCategoryUpdateStatus(), checkPermission(page, 'update_status'), categoryUpdateStatusController)

export default routes
