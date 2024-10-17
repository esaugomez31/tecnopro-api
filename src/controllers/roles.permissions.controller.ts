import { Response } from 'express'
import * as rolePermissionService from '../services/role.permissions.service'
import {
  IDRoleNotFoundError
} from '../errors'
import {
  iRolePermissionCommonRequest
} from '../interfaces'

export const rolePermissionUpdateController = async (req: iRolePermissionCommonRequest, res: Response): Promise<void> => {
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
