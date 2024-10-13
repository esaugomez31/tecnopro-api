const ErrorFactory = (name: string, msg: string): new (...args: any[]) => Error => {
  return class BusinessError extends Error {
    constructor (message: string) {
      super(message)
      this.name = name
      this.stack = ''
      this.message = msg
    }
  }
}

export default ErrorFactory
