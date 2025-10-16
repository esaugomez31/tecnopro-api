import ErrorFactory from "./error.factory"

export const IDBrandNotFoundError = ErrorFactory(
  "Brand not found",
  "The Brand could not be found in the system. Make sure the idBrand is correct.",
)
export const NameExistsError = ErrorFactory(
  "Name already exists",
  "The name is already in use. Please try a different one.",
)
