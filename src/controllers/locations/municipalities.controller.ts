import { Request, Response } from 'express'
import { matchedData } from 'express-validator'

import { filtersettings } from '../../helpers'
import * as municipalityService from '../../services/locations/municipalities.service'
import {
  IDMunicipalityNotFoundError,
  MunicipalityCodeExistsError,
  IDMuniCountryNotFoundError,
  IDMuniDepartmentNotFoundError,
  NameExistsError
} from '../../errors/locations/municipality.factory'
import {
  IMunicipalityGetCustomRequest,
  IMunicipalityCommonRequest,
  IMunicipalityFilters,
  IMunicipality
} from '../../interfaces'

export const municipalityCreateController = async (req: IMunicipalityCommonRequest, res: Response): Promise<void> => {
  try {
    const body = matchedData<IMunicipality>(req, {
      locations: ['body'], includeOptionals: true
    })
    // Service create municipality
    const municipality = await municipalityService.municipalityCreate(body)

    res.json(municipality)
  } catch (error) {
    if (error instanceof IDMuniCountryNotFoundError || error instanceof IDMuniDepartmentNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof NameExistsError || error instanceof MunicipalityCodeExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const municipalityUpdateController = async (req: IMunicipalityCommonRequest, res: Response): Promise<void> => {
  try {
    const idMunicipality = Number(req.params.idMunicipality)
    const body = matchedData<IMunicipality>(req, {
      locations: ['body'], includeOptionals: true
    })
    // Service update municipality
    const municipality = await municipalityService.municipalityUpdate(body, idMunicipality)

    res.json(municipality)
  } catch (error) {
    if (error instanceof IDMunicipalityNotFoundError || error instanceof IDMuniCountryNotFoundError || error instanceof IDMuniDepartmentNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof NameExistsError || error instanceof MunicipalityCodeExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const municipalityUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idMunicipality = Number(req.params.idMunicipality)
    const status = Boolean(req.params.status)
    // update status service
    const municipality = await municipalityService.municipalityUpdateStatus(idMunicipality, status)

    res.json(municipality)
  } catch (error) {
    if (error instanceof IDMunicipalityNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const municipalityGetAllController = async (req: IMunicipalityGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params municipality
    const params: IMunicipalityFilters = {
      name: query.name,
      status: query.status,
      dteCode: query.dteCode,
      zipCode: query.zipCode,
      idCountry: query.idCountry,
      idDepartment: query.idDepartment
    }

    const municipalities = await municipalityService.municipalityGetAll(params, settings)
    res.json(municipalities)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const municipalityGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get municipality id param
    const idMunicipality: number = Number(req.params.idMunicipality)

    const municipality = await municipalityService.municipalityGetById(idMunicipality)

    res.json(municipality)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
