import ErrorFactory from "../error.factory"

export const IDDepCountryNotFoundError = ErrorFactory(
  "Country not found",
  "The Country could not be found in the system. Make sure the idCountry is correct.",
)
export const IDDepartmentNotFoundError = ErrorFactory(
  "Department not found",
  "The Department could not be found in the system. Make sure the idDepartment is correct.",
)
export const NameExistsError = ErrorFactory(
  "Name already exists",
  "The name is already in use. Please try a different one.",
)
export const DepartmentCodeExistsError = ErrorFactory(
  "DteCode already exists",
  "The DteCode is already in use. Please try a different one.",
)
