import ErrorFactory from "./error.factory"

export const InvalidUserCredentialsError = ErrorFactory(
  "Invalid credentials",
  "The provided credentials are incorrect. Please check your username and password and try again.",
)
export const UserNotFoundError = ErrorFactory(
  "User not found",
  "The user could not be found in the system. Please ensure the username or email is correct.",
)
export const UsernameExistsError = ErrorFactory(
  "Username already exists",
  "The username is already in use. Please try a different one.",
)
export const EmailExistsError = ErrorFactory(
  "Email already exists",
  "The email address is already registered. Please use a different email or log in.",
)
export const UserIDNotFoundError = ErrorFactory(
  "User not found",
  "The idUser could not be found in the system.",
)
export const UserActionNotAllowedError = ErrorFactory(
  "Action not allowedd",
  "The hierarchy of your users does not allow you to perform this action.",
)
