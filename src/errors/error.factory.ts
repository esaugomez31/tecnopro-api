import { ErrorConstructor } from "../interfaces/error.interfaces"

const ErrorFactory = (name: string, message: string): ErrorConstructor => {
  return class BusinessError extends Error {
    constructor() {
      super(message)
      Object.setPrototypeOf(this, new.target.prototype)
      this.name = name
    }
  }
}

export default ErrorFactory
