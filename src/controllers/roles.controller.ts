import { Request, Response } from 'express'
import * as roleService from '../services/roles.service'
import { RoleModel } from '../models'
import { filtersettings } from '../helpers'
import {
  NameExistsError
} from '../errors'
import {
  iRoleGetCustomRequest,
  iRoleCommonRequest,
  iRoleFilters
} from '../interfaces'

export const roleCreateController = async (req: iRoleCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body

    // Model role object
    const payload = new RoleModel()
    payload.name = body.name
    payload.status = true

    const role = await roleService.roleCreate(payload)

    res.json(role)
  } catch (error) {
    if (error instanceof NameExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const roleUpdateController = async (req: iRoleCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body
    const idRole = Number(req.params.idRole)

    // Model role object
    const payload = new RoleModel()
    payload.name = body.name
    payload.status = body.status

    const role = await roleService.roleUpdate(payload, idRole)

    res.json(role)
  } catch (error) {
    if (error instanceof NameExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const roleGetAllController = async (req: iRoleGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params role
    const params: iRoleFilters = {
      name: query.name,
      status: query.status
    }

    const roles = await roleService.roleGetAll(params, settings)

    res.json(roles)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const roleGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get role id param
    const idRole: number = Number(req.params.idRole)

    const roles = await roleService.roleGetById(idRole)

    res.json(roles)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
