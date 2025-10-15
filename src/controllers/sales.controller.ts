import { Request, Response } from 'express'
import { matchedData } from 'express-validator'

import * as saleService from '../services/sales.service'
import { filtersettings } from '../helpers'
import {
  IDSaleNotFoundError,
  IDSaleBranchNotFoundError,
  CreateSaleMissingProductError,
  IDSaleCustomerNotFoundError,
  GetSaleCreatedDetailError,
  SaleProductNotFoundError,
  CreateSaleDetailError,
  CreateSaleError

} from '../errors/sale.error'
import {
  ISaleGetCustomRequest,
  ISaleCommonRequest,
  ISaleRequest,
  ISaleFilters
} from '../interfaces'

export const saleCreateController = async (req: ISaleCommonRequest, res: Response): Promise<void> => {
  try {
    const idUser = req.session?.idUser as number
    const body = matchedData<ISaleRequest>(req, {
      locations: ['body'], includeOptionals: true
    })

    // Service to generate sale
    const sale = await saleService.saleGenerate(body, idUser)

    res.json(sale)
  } catch (error) {
    if (
      error instanceof IDSaleBranchNotFoundError ||
      error instanceof IDSaleCustomerNotFoundError ||
      error instanceof GetSaleCreatedDetailError
    ) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (
      error instanceof CreateSaleError ||
      error instanceof CreateSaleDetailError ||
      error instanceof SaleProductNotFoundError
    ) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof CreateSaleMissingProductError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const saleUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idSale = Number(req.params.idSale)
    const status = Boolean(req.params.status)
    // update status service
    const sale = await saleService.saleUpdateStatus(idSale, status)

    res.json(sale)
  } catch (error) {
    if (error instanceof IDSaleNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const saleGetAllController = async (req: ISaleGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params sale
    const params: ISaleFilters = {
      uuid: query.uuid,
      idUser: query.idUser,
      idCustomer: query.idCustomer,
      idBranch: query.idBranch,
      startDate: query.startDate,
      endDate: query.endDate,
      status: query.status
    }

    const sales = await saleService.saleGetAll(params, settings)
    res.json(sales)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const saleGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get sale id param
    const idSale: number = Number(req.params.idSale)
    // Filter params settings
    const settings = filtersettings(req.query)

    const sale = await saleService.saleGetById(idSale, settings)

    res.json(sale)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
