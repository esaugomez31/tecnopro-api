import { Request, Response } from 'express'
import { matchedData } from 'express-validator'

import * as roleService from '../services/roles.service'
import { filtersettings } from '../helpers'
import {
  IDRoleNotFoundError,
  NameExistsError
} from '../errors/role.error'
import {
  IRoleGetCustomRequest,
  IRoleCommonRequest,
  IRoleFilters,
  IRole
} from '../interfaces'

export const roleCreateController = async (req: IRoleCommonRequest, res: Response): Promise<void> => {
  try {
    const body = matchedData<IRole>(req, {
      locations: ['body'], includeOptionals: true
    })

    // Service create Role
    const role = await roleService.roleCreate(body)

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

export const roleUpdateController = async (req: IRoleCommonRequest, res: Response): Promise<void> => {
  try {
    const idRole = Number(req.params.idRole)
    const body = matchedData<IRole>(req, {
      locations: ['body'], includeOptionals: true
    })

    // Servide update Role
    const role = await roleService.roleUpdate(body, idRole)

    res.json(role)
  } catch (error) {
    if (error instanceof IDRoleNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof NameExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const roleUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idRole = Number(req.params.idRole)
    const status = Boolean(req.params.status)
    // update status service
    const role = await roleService.roleUpdateStatus(idRole, status)

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

export const roleGetAllController = async (req: IRoleGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params role
    const params: IRoleFilters = {
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
