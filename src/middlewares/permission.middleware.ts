import { Request, Response, NextFunction } from 'express'
import { iUserJWT } from '../interfaces/user.interfaces'
import { getRolePermissions } from '../services'
import { hasPermission } from '../helpers'
import {
  UserRoleEnum,
  RolePermissionModel,
  PermissionModel,
  systemPageEnum
} from '../models'

export const checkPermission = (systemPage?: string, permissionName: string = '') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { type, idRole } = req.session as iUserJWT

    // No permissions required for the administrator accounts
    if (type === UserRoleEnum.ADMIN || type === UserRoleEnum.SUB_ADMIN) return next()

    // Undefined permission is only for admins
    if (systemPage === undefined) {
      res.status(403).json({ error: 'Access denied' })
    }

    // Get roles permissions
    const rolePermissions: RolePermissionModel[] = await getRolePermissions(idRole as number, systemPage as systemPageEnum)
    // Mapping permissions
    const permissions: PermissionModel[] = rolePermissions.map(rolePermission => {
      return rolePermission.permissionDetail
    }).filter(Boolean)

    if (hasPermission(permissions, permissionName)) {
      req.permissions = permissions
      return next()
    } else {
      res.status(403).json({ error: 'Access denied' })
    }
  }
}
