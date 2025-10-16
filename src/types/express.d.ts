import { IUserJWT, IPermission } from "../interfaces"

declare global {
  namespace Express {
    interface Request {
      session?: IUserJWT
      permissions: IPermission[]
    }
  }
}
