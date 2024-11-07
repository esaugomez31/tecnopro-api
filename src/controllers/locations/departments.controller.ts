import { Request, Response } from 'express'
import { matchedData } from 'express-validator'
import { DepartmentModel } from '../../models'
import { filtersettings } from '../../helpers'
import * as departmentService from '../../services/locations/departments.service'
import {
  NameExistsError,
  DepartmentCodeExistsError,
  IDDepCountryNotFoundError,
  IDDepartmentNotFoundError
} from '../../errors/locations/department.factory'
import {
  iDepartmentGetCustomRequest,
  iDepartmentCommonRequest,
  iDepartmentFilters
} from '../../interfaces'

export const departmentCreateController = async (req: iDepartmentCommonRequest, res: Response): Promise<void> => {
  try {
    const body = matchedData<DepartmentModel>(req, {
      locations: ['body'], includeOptionals: true
    })

    // Model department object
    const payload = new DepartmentModel()
    Object.assign(payload, body)

    const department = await departmentService.departmentCreate(payload)

    res.json(department)
  } catch (error) {
    if (error instanceof IDDepCountryNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof NameExistsError || error instanceof DepartmentCodeExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const departmentUpdateController = async (req: iDepartmentCommonRequest, res: Response): Promise<void> => {
  try {
    const idDepartment = Number(req.params.idDepartment)
    const body = matchedData<DepartmentModel>(req, {
      locations: ['body'], includeOptionals: true
    })

    // Model department object
    const payload = new DepartmentModel()
    Object.assign(payload, body)

    const department = await departmentService.departmentUpdate(payload, idDepartment)

    res.json(department)
  } catch (error) {
    if (error instanceof IDDepartmentNotFoundError || error instanceof IDDepCountryNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof NameExistsError || error instanceof DepartmentCodeExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const departmentUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idDepartment = Number(req.params.idDepartment)
    const status = Boolean(req.params.status)
    // update status service
    const department = await departmentService.departmentUpdateStatus(idDepartment, status)

    res.json(department)
  } catch (error) {
    if (error instanceof IDDepartmentNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const departmentGetAllController = async (req: iDepartmentGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params department
    const params: iDepartmentFilters = {
      name: query.name,
      status: query.status,
      dteCode: query.dteCode,
      zipCode: query.zipCode,
      idCountry: query.idCountry
    }

    const departments = await departmentService.departmentGetAll(params, settings)
    res.json(departments)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const departmentGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get department id param
    const idDepartment: number = Number(req.params.idDepartment)
    // Filter params settings
    const settings = filtersettings(req.query)
    const department = await departmentService.departmentGetById(idDepartment, settings)

    res.json(department)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
