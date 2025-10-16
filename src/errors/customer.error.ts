import ErrorFactory from "./error.factory"

export const IDCustNotFoundError = ErrorFactory(
  "Customer not found",
  "The Customer could not be found in the system. Make sure the idCustomer is correct.",
)
export const IDCountryNotFoundError = ErrorFactory(
  "Country not found",
  "The Country could not be found in the system. Make sure the idCountry is correct.",
)
export const IDDepartmentNotFoundError = ErrorFactory(
  "Department not found",
  "The Department could not be found in the system. Make sure the idDepartment is correct.",
)
export const IDMunicipalityNotFoundError = ErrorFactory(
  "Municipality not found",
  "The Municipality could not be found in the system. Make sure the idMunicipality is correct.",
)
