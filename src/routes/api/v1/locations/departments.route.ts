import express from 'express'
import {
  departmentCreateController,
  departmentUpdateController,
  departmentGetByIdController,
  departmentGetAllController,
  departmentUpdateStatusController
} from '../../../../controllers/locations'
import {
  validateDepartmentCreation,
  validateDepartmentUpdate,
  validateGetDepartmentById,
  validateGetDepartments,
  validateDepartmentUpdateStatus
} from '../../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../../middlewares'

const routes = express.Router()

// Get departments
routes.get('/', authenticationJWT, validateGetDepartments(), departmentGetAllController)
routes.get('/:idDepartment', authenticationJWT, validateGetDepartmentById(), departmentGetByIdController)

// Department actions
routes.post('/register', authenticationJWT, validateDepartmentCreation(), checkPermission(), departmentCreateController)
routes.put('/update/:idDepartment', authenticationJWT, validateDepartmentUpdate(), checkPermission(), departmentUpdateController)
routes.put('/:idDepartment/status/:status', authenticationJWT, validateDepartmentUpdateStatus(), checkPermission(), departmentUpdateStatusController)

export default routes
