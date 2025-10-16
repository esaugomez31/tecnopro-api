import { Request, Response, NextFunction } from "express"

import { IUserJWT, UserRoleEnum } from "../interfaces/user.interfaces"
import { getRolePermissionsByPage } from "../services/role.permissions.service"
import { SystemPageEnum, IPermission } from "../interfaces"
import { hasPermission } from "../helpers"
import { PermissionDeniedError } from "../errors/auth.error"

export const checkPermission = (
  systemPage?: SystemPageEnum,
  permissionName: string = "",
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type, idRole } = req.session as IUserJWT

      // No permissions required for the administrator accounts
      if (type === UserRoleEnum.ADMIN || type === UserRoleEnum.SUBADMIN) return next()

      // Undefined permission is only for admins - or user don't have role
      if (systemPage === undefined || typeof idRole !== "number") {
        throw new PermissionDeniedError()
      }

      // Get permissions
      const permissions: IPermission[] = await getRolePermissionsByPage(
        idRole,
        systemPage,
      )

      if (hasPermission(permissions, permissionName)) {
        req.permissions = permissions
        return next()
      } else {
        throw new PermissionDeniedError()
      }
    } catch (error) {
      if (error instanceof PermissionDeniedError) {
        res.status(403).json({ error: error.name, message: error.message })
        return
      }

      res
        .status(500)
        .json({ error: "Internal server error", message: "Permission error" })
    }
  }
}
