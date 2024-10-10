import ErrorFactory from './error.factory'

export const InvalidUserCredentialsError = ErrorFactory('Invalid Credentials')
export const UsernameExistsError = ErrorFactory('Username already exists')
export const EmailExistsError = ErrorFactory('Email already exists')
