import ErrorFactory from "./error.factory"

export const IDCategoryNotFoundError = ErrorFactory(
  "Category not found",
  "The category could not be found in the system. Make sure the idCategory is correct.",
)
export const NameExistsError = ErrorFactory(
  "Name already exists",
  "The name is already in use. Please try a different one.",
)
