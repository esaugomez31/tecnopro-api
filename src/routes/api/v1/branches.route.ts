import express from 'express'
import {
  branchCreateController,
  branchUpdateController,
  branchGetByIdController,
  branchGetAllController,
  branchUpdateStatusController
} from '../../../controllers/branches.controller'
import { BranchPermEnum, SystemPageEnum } from '../../../interfaces'
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
const page = SystemPageEnum.BRANCHES

// Get branches
routes.get('/', authenticationJWT, validateGetBranches(), branchGetAllController)
routes.get('/:idBranch', authenticationJWT, validateGetBranchById(), branchGetByIdController)

// Branch actions
routes.post('/register', authenticationJWT, validateBranchCreation(), checkPermission(page, BranchPermEnum.CREATE), branchCreateController)
routes.put('/update/:idBranch', authenticationJWT, validateBranchUpdate(), checkPermission(page, BranchPermEnum.UPDATE), branchUpdateController)
routes.put('/:idBranch/status/:status', authenticationJWT, validateBranchUpdateStatus(), checkPermission(page, BranchPermEnum.UPDATESTATUS), branchUpdateStatusController)

export default routes
