import { Request, Response } from 'express'
import { BranchModel } from '../models'
import { filtersettings } from '../helpers'
import * as branchService from '../services/branches.service'
import {
  IDBranchMunicipalityNotFoundError,
  IDBranchCountryNotFoundError,
  IDBranchDepartmentNotFoundError,
  IDBranchNotFoundError
} from '../errors/branch.factory'
import {
  iBranchGetCustomRequest,
  iBranchCommonRequest,
  iBranchFilters
} from '../interfaces'

export const branchCreateController = async (req: iBranchCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body

    // Model branch object
    const payload = new BranchModel()
    payload.name = body.name
    payload.description = body.description
    payload.phoneNumber = body.phoneNumber
    payload.email = body.email
    payload.address = body.address
    payload.idCountry = body.idCountry
    payload.idDepartment = body.idDepartment
    payload.idMunicipality = body.idMunicipality
    // DTE Fields
    if (body.dte !== null && body.dte !== undefined) {
      Object.assign(payload, body.dte)
    }
    payload.status = true
    // Create Branch
    const branch = await branchService.branchCreate(payload)

    res.json(branch)
  } catch (error) {
    if (
      error instanceof IDBranchMunicipalityNotFoundError ||
      error instanceof IDBranchCountryNotFoundError ||
      error instanceof IDBranchDepartmentNotFoundError
    ) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const branchUpdateController = async (req: iBranchCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body
    const idBranch = Number(req.params.idBranch)

    // Model branch object
    const payload = new BranchModel()
    payload.name = body.name
    payload.description = body.description
    payload.phoneNumber = body.phoneNumber
    payload.email = body.email
    payload.address = body.address
    payload.idCountry = body.idCountry
    payload.idDepartment = body.idDepartment
    payload.idMunicipality = body.idMunicipality
    // DTE Fields
    if (body.dte !== null && body.dte !== undefined) {
      Object.assign(payload, body.dte)
    }
    // Update Branch
    const branch = await branchService.branchUpdate(payload, idBranch)

    res.json(branch)
  } catch (error) {
    if (
      error instanceof IDBranchMunicipalityNotFoundError ||
      error instanceof IDBranchCountryNotFoundError ||
      error instanceof IDBranchDepartmentNotFoundError ||
      error instanceof IDBranchNotFoundError
    ) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const branchUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idBranch = Number(req.params.idBranch)
    const status = Boolean(req.params.status)
    // update status service
    const branch = await branchService.branchUpdateStatus(idBranch, status)

    res.json(branch)
  } catch (error) {
    if (error instanceof IDBranchMunicipalityNotFoundError || error instanceof IDBranchNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const branchGetAllController = async (req: iBranchGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params branch
    const params: iBranchFilters = {
      name: query.name,
      uuid: query.uuid,
      description: query.description,
      phoneNumber: query.phoneNumber,
      email: query.email,
      idCountry: query.idCountry,
      idDepartment: query.idDepartment,
      idMunicipality: query.idMunicipality,
      status: query.status
    }

    const branches = await branchService.branchGetAll(params, settings)
    res.json(branches)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const branchGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get branch id param
    const idBranch: number = Number(req.params.idBranch)

    const branch = await branchService.branchGetById(idBranch)

    res.json(branch)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
