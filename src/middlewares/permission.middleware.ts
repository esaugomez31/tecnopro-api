import { Request, Response, NextFunction } from 'express'
import { iUserJWT } from '../interfaces/user.interfaces'
import { getRolePermissionsByPage } from '../services'
import { hasPermission } from '../helpers'
import {
  UserRoleEnum,
  PermissionModel,
  systemPageEnum
} from '../models'

export const checkPermission = (systemPage?: string, permissionName: string = '') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { type, idRole } = req.session as iUserJWT

    // No permissions required for the administrator accounts
    if (type === UserRoleEnum.ADMIN || type === UserRoleEnum.SUBADMIN) return next()

    // Undefined permission is only for admins
    if (systemPage === undefined) {
      res.status(403).json({ error: 'Access denied' })
    }

    // Get permissions
    const permissions: PermissionModel[] = await getRolePermissionsByPage(
      idRole as number,
      systemPage as systemPageEnum
    )

    if (hasPermission(permissions, permissionName)) {
      req.permissions = permissions
      return next()
    } else {
      res.status(403).json({ error: 'Access denied' })
    }
  }
}
