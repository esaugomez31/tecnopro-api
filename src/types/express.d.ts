import { iUserJWT } from '../interfaces/user.interfaces'

declare global {
  namespace Express {
    interface Request {
      session?: iUserJWT
    }
  }
}
