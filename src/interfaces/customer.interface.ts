import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { CustomerModel } from '../models'
import { iFilterSettings } from './filter.interfaces'

export enum CustomerPermEnum {
  VIEWLIST = 'view_list',
  CREATE = 'create',
  UPDATE = 'update',
  UPDATESTATUS = 'update_status',
}

// Allow filter params from API
export interface iCustomerFilters {
  name?: string
  uuid?: string
  dui?: string
  nit?: string
  nrc?: string
  phoneNumbers?: string
  whatsappNumber?: string
  tradeName?: string
  email?: string
  idCountry?: number
  idDepartment?: number
  idMunicipality?: number
  status?: boolean
}

type paramsFilertypeLike = 'name' | 'dui' | 'nit' | 'nrc' | 'phoneNumbers' | 'whatsappNumber' | 'tradeName' | 'email'

// Filter options to customer in typeorm
export interface iCustomerQueryParams extends Omit<iCustomerFilters, paramsFilertypeLike> {
  name?: FindOperator<string> | string
  dui?: FindOperator<string> | string
  nit?: FindOperator<string> | string
  nrc?: FindOperator<string> | string
  phoneNumbers?: FindOperator<string> | string
  whatsappNumber?: FindOperator<string> | string
  tradeName?: FindOperator<string> | string
  email?: FindOperator<string> | string
}

// Multi customers response interface
export interface iGetCustomersResponse {
  data: CustomerModel[]
  total: number
  page: number
  totalPages: number
}

// Unique customer response
export interface iGetCustomerByIdResponse {
  data: CustomerModel | {}
}

// Custom request to type customers get controllers
export interface iCustomerGetCustomRequest extends Request {
  query: iCustomerFilters & iFilterSettings & ParsedQs
}

// Custom request to type customers create controllers
export interface iCustomerCommonRequest extends Request {
  body: CustomerModel & ParsedQs
}
