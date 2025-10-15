import { Request, Response } from 'express'
import { matchedData } from 'express-validator'

import * as brandService from '../services/brands.service'
import { filtersettings } from '../helpers'
import {
  NameExistsError,
  IDBrandNotFoundError
} from '../errors/brand.error'
import {
  IBrandGetCustomRequest,
  IBrandCommonRequest,
  IBrandFilters,
  IBrand
} from '../interfaces'

export const brandCreateController = async (req: IBrandCommonRequest, res: Response): Promise<void> => {
  try {
    const body = matchedData<IBrand>(req, {
      locations: ['body'], includeOptionals: true
    })
    // Service create brand
    const brand = await brandService.brandCreate(body)

    res.json(brand)
  } catch (error) {
    if (error instanceof NameExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const brandUpdateController = async (req: IBrandCommonRequest, res: Response): Promise<void> => {
  try {
    const idBrand = Number(req.params.idBrand)
    const body = matchedData<IBrand>(req, {
      locations: ['body'], includeOptionals: true
    })
    // Service update brand
    const brand = await brandService.brandUpdate(body, idBrand)

    res.json(brand)
  } catch (error) {
    if (error instanceof IDBrandNotFoundError) {
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

export const brandUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idBrand = Number(req.params.idBrand)
    const status = Boolean(req.params.status)
    // update status service
    const brand = await brandService.brandUpdateStatus(idBrand, status)

    res.json(brand)
  } catch (error) {
    if (error instanceof IDBrandNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const brandGetAllController = async (req: IBrandGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params brand
    const params: IBrandFilters = {
      name: query.name,
      status: query.status,
      description: query.description,
      uuid: query.uuid
    }

    const brands = await brandService.brandGetAll(params, settings)
    res.json(brands)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const brandGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get brand id param
    const idBrand: number = Number(req.params.idBrand)

    const brand = await brandService.brandGetById(idBrand)

    res.json(brand)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
