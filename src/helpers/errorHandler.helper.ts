import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req)
  // const errors = validationResult(req).array({ onlyFirstError: true })
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: any) => ({
      error: error.msg,
      field: error.path,
      location: error.location,
      value: error.value,
    }))

    res.status(400).json({ errors: formattedErrors })
    return
  }

  next()
}
