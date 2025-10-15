import { matchedData } from "express-validator"
import { Request, Response } from "express"

import { filtersettings } from "../helpers"
import * as branchService from "../services/branches.service"
import {
  IDBranchMunicipalityNotFoundError,
  IDBranchCountryNotFoundError,
  IDBranchDepartmentNotFoundError,
  IDBranchNotFoundError,
} from "../errors/branch.error"
import {
  IBranchGetCustomRequest,
  IBranchCommonRequest,
  IBranchCommonBody,
  IBranchFilters,
} from "../interfaces"

export const branchCreateController = async (
  req: IBranchCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = matchedData<IBranchCommonBody>(req, {
      locations: ["body"],
      includeOptionals: true,
    })

    // Create Branch
    const branch = await branchService.branchCreate(body)

    res.json(branch ?? {})
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
    res.status(500).json({ error: "Internal server error" })
  }
}

export const branchUpdateController = async (
  req: IBranchCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const idBranch = Number(req.params.idBranch)
    const body = matchedData<IBranchCommonBody>(req, {
      locations: ["body"],
      includeOptionals: true,
    })

    // Update Branch
    const branch = await branchService.branchUpdate(body, idBranch)

    res.json(branch ?? {})
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
    res.status(500).json({ error: "Internal server error" })
  }
}

export const branchUpdateStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const idBranch = Number(req.params.idBranch)
    const status = Boolean(req.params.status)
    // update status service
    const branch = await branchService.branchUpdateStatus(idBranch, status)

    res.json(branch ?? {})
  } catch (error) {
    if (error instanceof IDBranchNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const branchGetAllController = async (
  req: IBranchGetCustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params branch
    const params: IBranchFilters = {
      name: query.name,
      uuid: query.uuid,
      description: query.description,
      phoneNumber: query.phoneNumber,
      email: query.email,
      idCountry: query.idCountry,
      idDepartment: query.idDepartment,
      idMunicipality: query.idMunicipality,
      status: query.status,
    }

    const branches = await branchService.branchGetAll(params, settings)
    res.json(branches)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const branchGetByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get branch id param
    const idBranch: number = Number(req.params.idBranch)

    const branch = await branchService.branchGetById(idBranch)

    res.json(branch)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}
