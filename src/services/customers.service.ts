import { v4 as uuidv4 } from 'uuid'
import { logger, applyFilter } from '../helpers'
import {
  CustomerModel,
  CountryModel,
  DepartmentModel,
  MunicipalityModel
} from '../models'
import {
  iFilterSettings,
  iGetCustomerByIdResponse,
  iGetCustomersResponse,
  iCustomerQueryParams,
  iCustomerFilters
} from '../interfaces'
import {
  IDCountryNotFoundError,
  IDDepartmentNotFoundError,
  IDMunicipalityNotFoundError,
  IDCustNotFoundError
} from '../errors/customer.error'

export const customerCreate = async (customer: CustomerModel): Promise<CustomerModel | {}> => {
  try {
    // Searching for name matches
    await existValuesValidations(
      customer.idCountry,
      customer.idDepartment,
      customer.idMunicipality
    )

    // Generate UUID
    customer.uuid = uuidv4()
    // Create customer
    const createdCustomer = await CustomerModel.save(customer)

    // return db response
    const getCustomer = await CustomerModel.findOne({
      where: { idCustomer: createdCustomer.idCustomer }
    })

    return getCustomer ?? {}
  } catch (error) {
    logger.error('Create customer: ' + (error as Error).name)
    throw error
  }
}

export const customerUpdate = async (customer: CustomerModel, idCustomer: number): Promise<CustomerModel | {}> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idCustomer),
      existValuesValidations(
        customer.idCountry,
        customer.idDepartment,
        customer.idMunicipality
      )
    ])

    // update customer
    const updatedCustomer = await CustomerModel.save({
      idCustomer, ...customer
    })

    // return db response
    const getCustomer = await CustomerModel.findOne({
      where: { idCustomer: updatedCustomer.idCustomer }
    })

    return getCustomer ?? {}
  } catch (error) {
    logger.error('Update customer: ' + (error as Error).name)
    throw error
  }
}

export const customerUpdateStatus = async (idCustomer: number, status: boolean): Promise<CustomerModel | {}> => {
  try {
    // Existing customer
    await existIdValidation(idCustomer)

    // update customer status
    const updatedCustomer = await CustomerModel.save({
      idCustomer, status
    })

    // return db response
    const getCustomer = await CustomerModel.findOne({
      where: { idCustomer: updatedCustomer.idCustomer }
    })
    return getCustomer ?? {}
  } catch (error) {
    logger.error('Update customer status: ' + (error as Error).name)
    throw error
  }
}

export const customerGetAll = async (filterParams: iCustomerFilters, settings: iFilterSettings): Promise<iGetCustomersResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [customers, totalCount] = await Promise.all([
      CustomerModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      CustomerModel.count({ where: filters })
    ])

    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: customers,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get customers: ' + (error as Error).name)
    throw error
  }
}

export const customerGetById = async (idCustomer: number): Promise<iGetCustomerByIdResponse> => {
  try {
    const customer = await CustomerModel.findOne({
      where: { idCustomer }
    })

    return { data: customer }
  } catch (error) {
    logger.error('Get customer by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (params: iCustomerFilters): iCustomerQueryParams => {
  const filters: iCustomerQueryParams = {}

  applyFilter(filters, 'name', params.name, true)
  applyFilter(filters, 'dui', params.dui, true)
  applyFilter(filters, 'nit', params.nit, true)
  applyFilter(filters, 'nrc', params.nrc, true)
  applyFilter(filters, 'phoneNumbers', params.phoneNumbers, true)
  applyFilter(filters, 'whatsappNumber', params.whatsappNumber, true)
  applyFilter(filters, 'tradeName', params.tradeName, true)
  applyFilter(filters, 'email', params.email, true)
  applyFilter(filters, 'uuid', params.uuid)
  applyFilter(filters, 'idCountry', params.idCountry)
  applyFilter(filters, 'idDepartment', params.idDepartment)
  applyFilter(filters, 'idMunicipality', params.idMunicipality)
  applyFilter(filters, 'status', params.status)

  return filters
}

const existValuesValidations = async (idCountry?: number, idDepartment?: number, idMunicipality?: number): Promise<void> => {
  if (idCountry === undefined && idMunicipality === undefined && idDepartment === undefined) return

  const [existCountry, existDepartment, existMunicipality] = await Promise.all([
    idCountry !== undefined
      ? CountryModel.findOne({ select: ['idCountry'], where: { idCountry } })
      : null,
    idDepartment !== undefined
      ? DepartmentModel.findOne({ select: ['idDepartment'], where: { idCountry, idDepartment } })
      : null,
    idMunicipality !== undefined
      ? MunicipalityModel.findOne({ select: ['idMunicipality'], where: { idCountry, idDepartment, idMunicipality } })
      : null
  ])

  if (idCountry !== undefined && existCountry === null) {
    throw new IDCountryNotFoundError()
  }

  if (idDepartment !== undefined && existDepartment === null) {
    throw new IDDepartmentNotFoundError()
  }

  if (idMunicipality !== undefined && existMunicipality === null) {
    throw new IDMunicipalityNotFoundError()
  }
}

const existIdValidation = async (idCustomer: number): Promise<void> => {
  // Existing customer per ID
  const existCustomer = await CustomerModel.findOne({
    select: ['idCustomer'], where: { idCustomer }
  })

  if (existCustomer === null) throw new IDCustNotFoundError()
}
