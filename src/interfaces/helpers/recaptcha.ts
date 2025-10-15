export interface IRecaptchaResponse {
  "success": boolean
  "hostname": string
  "score"?: number // Only reCAPTCHA v3
  "action"?: string // Only reCAPTCHA v3
  "error-codes"?: string[]
}
