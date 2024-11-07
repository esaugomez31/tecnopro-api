import { matchedData } from 'express-validator'
import { Request, Response } from 'express'
import { CustomerModel } from '../models'
import { filtersettings } from '../helpers'
import * as customerService from '../services/customers.service'
import {
  IDMunicipalityNotFoundError,
  IDCountryNotFoundError,
  IDDepartmentNotFoundError,
  IDCustNotFoundError
} from '../errors/customer.error'
import {
  iCustomerGetCustomRequest,
  iCustomerCommonRequest,
  iCustomerFilters
} from '../interfaces'

export const customerCreateController = async (req: iCustomerCommonRequest, res: Response): Promise<void> => {
  try {
    const body = matchedData<CustomerModel>(req, {
      locations: ['body']
    })

    // Model customer object
    const payload = new CustomerModel()
    Object.assign(payload, body)

    // Create Customer
    const customer = await customerService.customerCreate(payload)

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

export const customerUpdateController = async (req: iCustomerCommonRequest, res: Response): Promise<void> => {
  try {
    const idCustomer = Number(req.params.idCustomer)
    const body = matchedData<CustomerModel>(req, {
      locations: ['body']
    })

    // Model customer object
    const payload = new CustomerModel()
    Object.assign(payload, body)

    // Update Customer
    const customer = await customerService.customerUpdate(payload, idCustomer)

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

export const customerGetAllController = async (req: iCustomerGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = matchedData<iCustomerFilters>(req, {
      locations: ['query']
    })
    // Filter params settings
    const settings = filtersettings(req.query)
    // Filter params customer
    const params: iCustomerFilters = query

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
