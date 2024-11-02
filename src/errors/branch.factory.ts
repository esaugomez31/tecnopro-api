import ErrorFactory from './error.factory'

export const IDBranchCountryNotFoundError = ErrorFactory('Country not found', 'The Country could not be found in the system. Make sure the idCountry is correct.')
export const IDBranchDepartmentNotFoundError = ErrorFactory('Department not found', 'The Department could not be found in the system. Make sure the idDepartment is correct.')
export const IDBranchMunicipalityNotFoundError = ErrorFactory('Municipality not found', 'The Municipality could not be found in the system. Make sure the idMunicipality is correct.')
