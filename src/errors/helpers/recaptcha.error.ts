import ErrorFactory from "../error.factory"

export const ValidationErrorError = ErrorFactory(
  "Validation Error",
  "One or more inputs are invalid. Please verify the submitted data and try again.",
)

export const RecaptchaServerError = ErrorFactory(
  "ReCAPTCHA Server Error",
  "The reCAPTCHA verification process failed. Please try again later or contact support if the issue persists.",
)
