import express from 'express'
import {
  branchCreateController,
  branchUpdateController,
  branchGetByIdController,
  branchGetAllController,
  branchUpdateStatusController
} from '../../../controllers/branches.controller'
import {
  validateBranchCreation,
  validateBranchUpdate,
  validateGetBranchById,
  validateGetBranches,
  validateBranchUpdateStatus
} from '../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../middlewares'

const routes = express.Router()

// Get branches
routes.get('/', authenticationJWT, validateGetBranches(), checkPermission(), branchGetAllController)
routes.get('/:idBranch', authenticationJWT, validateGetBranchById(), checkPermission(), branchGetByIdController)

// Branch actions
routes.post('/register', authenticationJWT, validateBranchCreation(), checkPermission(), branchCreateController)
routes.put('/update/:idBranch', authenticationJWT, validateBranchUpdate(), checkPermission(), branchUpdateController)
routes.put('/:idBranch/status/:status', authenticationJWT, validateBranchUpdateStatus(), checkPermission(), branchUpdateStatusController)

export default routes
