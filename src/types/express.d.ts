import { iUserJWT } from '../interfaces/user.interfaces'
import { PermissionModel } from '../models/permissions.model'

declare global {
  namespace Express {
    interface Request {
      session?: iUserJWT
      permissions: PermissionModel[]
    }
  }
}
