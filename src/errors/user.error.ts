import ErrorFactory from './error.factory'

export const InvalidUserCredentialsError = ErrorFactory('Invalid Credentials')
export const UserNotFoundError = ErrorFactory('User Not Found')
export const UsernameExistsError = ErrorFactory('Username Already Exists')
export const EmailExistsError = ErrorFactory('Email Already Exists')
