import { Request, Response } from 'express'
import * as countryService from '../services/countries.service'
import { CountryModel } from '../models'
import { filtersettings } from '../helpers'
import {
  NameExistsError,
  CountryCodeExistsError,
  IDCountryNotFoundError
} from '../errors/country.factory'
import {
  iCountryGetCustomRequest,
  iCountryCommonRequest,
  iCountryFilters
} from '../interfaces'

export const countryCreateController = async (req: iCountryCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body

    // Model country object
    const payload = new CountryModel()
    payload.name = body.name
    payload.code = body.code
    payload.zipCode = body.zipCode
    payload.timeZone = body.timeZone
    payload.status = true

    const country = await countryService.countryCreate(payload)

    res.json(country)
  } catch (error) {
    if (error instanceof NameExistsError || error instanceof CountryCodeExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const countryUpdateController = async (req: iCountryCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body
    const idCountry = Number(req.params.idCountry)

    // Model country object
    const payload = new CountryModel()
    payload.name = body.name
    payload.code = body.code
    payload.zipCode = body.zipCode
    payload.timeZone = body.timeZone

    const country = await countryService.countryUpdate(payload, idCountry)

    res.json(country)
  } catch (error) {
    if (error instanceof IDCountryNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof NameExistsError || error instanceof CountryCodeExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const countryUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idCountry = Number(req.params.idCountry)
    const status = Boolean(req.params.status)
    // update status service
    const country = await countryService.countryUpdateStatus(idCountry, status)

    res.json(country)
  } catch (error) {
    if (error instanceof IDCountryNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const countryGetAllController = async (req: iCountryGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params country
    const params: iCountryFilters = {
      name: query.name,
      status: query.status,
      code: query.code,
      zipCode: query.zipCode
    }

    const countries = await countryService.countryGetAll(params, settings)
    res.json(countries)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const countryGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get country id param
    const idCountry: number = Number(req.params.idCountry)

    const country = await countryService.countryGetById(idCountry)

    res.json(country)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
