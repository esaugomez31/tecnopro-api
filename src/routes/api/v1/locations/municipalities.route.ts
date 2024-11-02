import express from 'express'
import {
  municipalityCreateController,
  municipalityUpdateController,
  municipalityGetByIdController,
  municipalityGetAllController,
  municipalityUpdateStatusController
} from '../../../../controllers/locations'
import {
  validateMunicipalityCreation,
  validateMunicipalityUpdate,
  validateGetMunicipalityById,
  validateGetMunicipalities,
  validateMunicipalityUpdateStatus
} from '../../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../../middlewares'

const routes = express.Router()

// Get municipalities
routes.get('/', authenticationJWT, validateGetMunicipalities(), municipalityGetAllController)
routes.get('/:idMunicipality', authenticationJWT, validateGetMunicipalityById(), municipalityGetByIdController)

// Municipality actions
routes.post('/register', authenticationJWT, validateMunicipalityCreation(), checkPermission(), municipalityCreateController)
routes.put('/update/:idMunicipality', authenticationJWT, validateMunicipalityUpdate(), checkPermission(), municipalityUpdateController)
routes.put('/:idMunicipality/status/:status', authenticationJWT, validateMunicipalityUpdateStatus(), checkPermission(), municipalityUpdateStatusController)

export default routes
