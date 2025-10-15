import { matchedData } from 'express-validator'
import { Request, Response } from 'express'

import { filtersettings } from '../helpers'
import * as customerService from '../services/customers.service'
import {
  IDMunicipalityNotFoundError,
  IDCountryNotFoundError,
  IDDepartmentNotFoundError,
  IDCustNotFoundError
} from '../errors/customer.error'
import {
  ICustomerGetCustomRequest,
  ICustomerCommonRequest,
  ICustomerFilters,
  ICustomer
} from '../interfaces'

export const customerCreateController = async (req: ICustomerCommonRequest, res: Response): Promise<void> => {
  try {
    const body = matchedData<ICustomer>(req, {
      locations: ['body'], includeOptionals: true
    })

    // Create Customer
    const customer = await customerService.customerCreate(body)

    res.json(customer)
  } catch (error) {
    if (
      error instanceof IDMunicipalityNotFoundError ||
      error instanceof IDCountryNotFoundError ||
      error instanceof IDDepartmentNotFoundError
    ) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const customerUpdateController = async (req: ICustomerCommonRequest, res: Response): Promise<void> => {
  try {
    const idCustomer = Number(req.params.idCustomer)
    const body = matchedData<ICustomer>(req, {
      locations: ['body'], includeOptionals: true
    })

    // Update Customer
    const customer = await customerService.customerUpdate(body, idCustomer)

    res.json(customer)
  } catch (error) {
    if (
      error instanceof IDMunicipalityNotFoundError ||
      error instanceof IDCountryNotFoundError ||
      error instanceof IDDepartmentNotFoundError ||
      error instanceof IDCustNotFoundError
    ) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const customerUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idCustomer = Number(req.params.idCustomer)
    const status = Boolean(req.params.status)
    // update status service
    const customer = await customerService.customerUpdateStatus(idCustomer, status)

    res.json(customer)
  } catch (error) {
    if (error instanceof IDCustNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const customerGetAllController = async (req: ICustomerGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = matchedData<ICustomerFilters>(req, {
      locations: ['query']
    })
    // Filter params settings
    const settings = filtersettings(req.query)
    // Filter params customer
    const params: ICustomerFilters = query

    const customers = await customerService.customerGetAll(params, settings)
    res.json(customers)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const customerGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get customer id param
    const idCustomer: number = Number(req.params.idCustomer)

    const customer = await customerService.customerGetById(idCustomer)

    res.json(customer)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
