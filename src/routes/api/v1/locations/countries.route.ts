import express from 'express'
import {
  countryCreateController,
  countryUpdateController,
  countryGetByIdController,
  countryGetAllController,
  countryUpdateStatusController
} from '../../../../controllers/locations'
import {
  validateCountryCreation,
  validateCountryUpdate,
  validateGetCountryById,
  validateGetCountries,
  validateCountryUpdateStatus
} from '../../../../middlewares/validations'
import {
  authenticationJWT,
  checkPermission
} from '../../../../middlewares'

const routes = express.Router()

// Get countries
routes.get('/', authenticationJWT, validateGetCountries(), countryGetAllController)
routes.get('/:idCountry', authenticationJWT, validateGetCountryById(), countryGetByIdController)

// Country actions
routes.post('/register', authenticationJWT, validateCountryCreation(), checkPermission(), countryCreateController)
routes.put('/update/:idCountry', authenticationJWT, validateCountryUpdate(), checkPermission(), countryUpdateController)
routes.put('/:idCountry/status/:status', authenticationJWT, validateCountryUpdateStatus(), checkPermission(), countryUpdateStatusController)

export default routes
