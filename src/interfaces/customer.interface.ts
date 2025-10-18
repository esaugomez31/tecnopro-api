import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings } from "./filter.interfaces"

export enum CustomerPermEnum {
  VIEWLIST = "view_list",
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
}

// Main customer interface
export interface ICustomer {
  idCustomer?: number
  uuid?: string | null
  name?: string | null
  tradeName?: string | null
  dui?: string | null
  nit?: string | null
  nrc?: string | null
  phoneNumbers?: string | null
  whatsappNumber?: string | null
  email?: string | null
  address?: string | null
  idCountry?: number | null
  idDepartment?: number | null
  idMunicipality?: number | null
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

// Allow filter params from API
export interface ICustomerFilters {
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

type ParamsFilertypeLike =
  | "name"
  | "dui"
  | "nit"
  | "nrc"
  | "phoneNumbers"
  | "whatsappNumber"
  | "tradeName"
  | "email"

// Filter options to customer in typeorm
export interface ICustomerQueryParams
  extends Omit<ICustomerFilters, ParamsFilertypeLike> {
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
export interface IGetCustomersResponse {
  data: ICustomer[]
  total: number
  page: number
  totalPages: number
}

// Unique customer response
export interface IGetCustomerByIdResponse {
  data: ICustomer | null
}

// Custom request to type customers get controllers
export interface ICustomerGetCustomRequest extends Request {
  query: ICustomerFilters & IFilterSettings & ParsedQs
}

// Custom request to type customers create controllers
export interface ICustomerCommonRequest extends Request {
  body: ICustomer
}
