import { Response, Request } from 'express'

import * as rolePermissionService from '../services/role.permissions.service'
import {
  IDRoleNotFoundError
} from '../errors/role.error'
import {
  IRolePermissionCommonRequest
} from '../interfaces'

export const rolePermissionUpdateController = async (req: IRolePermissionCommonRequest, res: Response): Promise<void> => {
  try {
    const idRole = Number(req.params.idRole)
    const permisssions = req.body.permissions

    const role = await rolePermissionService.rolePermissionUpdate(permisssions, idRole)

    res.json(role)
  } catch (error) {
    if (error instanceof IDRoleNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const rolePermissionGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get role permission by idRole param
    const idRole: number = Number(req.params.idRole)

    const roles = await rolePermissionService.rolePermissionGetById(idRole)

    res.json(roles)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
