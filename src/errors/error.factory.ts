const ErrorFactory = (name: string): new (...args: any[]) => Error => {
  return class BusinessError extends Error {
    constructor (message: string) {
      super(message)
      this.name = name
    }
  }
}

export default ErrorFactory
