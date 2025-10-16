import { Request, Response, NextFunction } from "express"
import { validationResult, type ValidationError } from "express-validator"

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req)
  // const errors = validationResult(req).array({ onlyFirstError: true })
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: ValidationError) => ({
      error: error.msg,
      field: "path" in error ? (error as { path: string }).path : undefined,
      location:
        "location" in error ? (error as { location: string }).location : undefined,
      value: "value" in error ? (error as { value: unknown }).value : undefined,
    }))

    res.status(400).json({ errors: formattedErrors })
    return
  }

  next()
}
