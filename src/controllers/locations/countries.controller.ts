import { Request, Response } from "express"
import { matchedData } from "express-validator"

import { filtersettings } from "../../helpers"
import * as countryService from "../../services/locations/countries.service"
import {
  NameExistsError,
  CountryCodeExistsError,
  IDCountryNotFoundError,
} from "../../errors/locations/country.factory"
import {
  ICountryGetCustomRequest,
  ICountryCommonRequest,
  ICountryFilters,
  ICountry,
} from "../../interfaces"

export const countryCreateController = async (
  req: ICountryCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = matchedData<ICountry>(req, {
      locations: ["body"],
      includeOptionals: true,
    })
    // Service create country
    const country = await countryService.countryCreate(body)

    res.json(country)
  } catch (error) {
    if (error instanceof NameExistsError || error instanceof CountryCodeExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const countryUpdateController = async (
  req: ICountryCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const idCountry = Number(req.params.idCountry)
    const body = matchedData<ICountry>(req, {
      locations: ["body"],
      includeOptionals: true,
    })
    // Service update country
    const country = await countryService.countryUpdate(body, idCountry)

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
    res.status(500).json({ error: "Internal server error" })
  }
}

export const countryUpdateStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
    res.status(500).json({ error: "Internal server error" })
  }
}

export const countryGetAllController = async (
  req: ICountryGetCustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params country
    const params: ICountryFilters = {
      name: query.name,
      status: query.status,
      code: query.code,
      zipCode: query.zipCode,
    }

    const countries = await countryService.countryGetAll(params, settings)
    res.json(countries)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const countryGetByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get country id param
    const idCountry: number = Number(req.params.idCountry)
    // Filter params settings
    const settings = filtersettings(req.query)
    const country = await countryService.countryGetById(idCountry, settings)

    res.json(country)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}
