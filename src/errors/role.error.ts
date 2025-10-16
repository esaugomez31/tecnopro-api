import ErrorFactory from "./error.factory"

export const IDRoleNotFoundError = ErrorFactory(
  "Role not found",
  "The role could not be found in the system. Make sure the idRole is correct.",
)
export const NameExistsError = ErrorFactory(
  "Name already exists",
  "The name is already in use. Please try a different one.",
)
