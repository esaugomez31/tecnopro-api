import ErrorFactory from "./error.factory"

export const AccessNotAuthorizedError = ErrorFactory(
  "Access not authorized",
  "You do not have the necessary permissions to access this resource.",
)
export const InvalidTokenError = ErrorFactory(
  "Invalid token",
  "The token provided is invalid.",
)
export const ExpiredTokenError = ErrorFactory(
  "Expired token",
  "The token you provided has expired. Please log in again to obtain a new token.",
)
export const InvalidOrExpiredTokenError = ErrorFactory(
  "Invalid or expired token",
  "The token provided is invalid or has expired.",
)
export const PermissionDeniedError = ErrorFactory(
  "Permission denied",
  "You do not have permission to perform this action.",
)
