import ErrorFactory from '../error.factory'

export const IDCountryNotFoundError = ErrorFactory('Country not found', 'The Country could not be found in the system. Make sure the idCountry is correct.')
export const NameExistsError = ErrorFactory('Name already exists', 'The name is already in use. Please try a different one.')
export const CountryCodeExistsError = ErrorFactory('Code already exists', 'The Code is already in use. Please try a different one.')
