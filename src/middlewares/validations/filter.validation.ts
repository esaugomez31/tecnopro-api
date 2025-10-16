import { query } from "express-validator"

export const validateFilterParams = (validSortFields: string[]): any => {
  return [
    query("page")
      .isInt({ min: 1 })
      .withMessage("page must be an integer greater than or equal to 1")
      .notEmpty()
      .withMessage("page is required")
      .customSanitizer(Number),

    query("limit")
      .isInt({ min: 1, max: 100 })
      .withMessage("limit must be a integer between 1 and 100")
      .notEmpty()
      .withMessage("limit is required")
      .customSanitizer(Number),

    query("orderBy")
      .isIn(validSortFields)
      .withMessage(`orderBy must be one of the following: ${validSortFields.join(", ")}.`)
      .customSanitizer((value) => value as string),

    query("orderDirection")
      .isIn(["ASC", "DESC"])
      .withMessage("orderDirection must be either ASC or DESC.")
      .customSanitizer((value) => value as string),
  ]
}

export const validateIncludeParams = (includeFields: string[]): any => {
  return [
    query("include")
      .optional()
      .isString()
      .custom((value) => {
        if (value !== undefined && value !== null) {
          const includes: string[] = value.split(",")
          // Validate only include fields
          for (const include of includes) {
            if (!includeFields.includes(include)) {
              throw new Error(
                `Invalid value '${include}', include contain at least one of the following fields separated by comma: ${includeFields.join(",")}.`,
              )
            }
          }
        }
        return true
      }),
  ]
}
