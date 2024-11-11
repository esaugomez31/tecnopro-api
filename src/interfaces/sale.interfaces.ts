// import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { FindOperator } from 'typeorm'
import { ParsedQs } from 'qs'
import { SaleModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
// import { OrmOperationAttributes } from './orm.interfaces'

export enum SalePermEnum {
  VIEWLIST = 'view_list',
  CREATE = 'create',
  UPDATESTATUS = 'update_status',
}

// Allow filter params from API
export interface iSaleFilters {
  uuid?: string
  idUser?: number
  idCustomer?: number
  idBranch?: number
  startDate?: string | Date
  endDate?: string | Date
  status?: boolean
}

// Filter options to sale in typeorm
export interface iSaleQueryParams extends iSaleFilters {
  createdAt?: FindOperator<Date>
}
// export interface iSaleQueryParams extends Omit<iSaleFilters, 'startDate' | 'endDate'> {}

// Multi sales response interface
export interface iGetSalesResponse {
  data: SaleModel[]
  total: number
  page: number
  totalPages: number
}

// Unique sale response
export interface iGetSaleByIdResponse {
  data: SaleModel | null
}

// Custom request to type sales get controllers
export interface iSaleGetCustomRequest extends Request {
  query: iSaleFilters & iFilterSettings & ParsedQs
}

export interface iSaleTotals {
  total: number
  subtotal: number
  vat: number
  totalProfit: number
  grossProfit: number
  usersCommission: number
  totalText: string
}

export interface iSaleProduct {
  idProduct: number
  price: number
  quantity: number
}

export interface iSaleRequest {
  idBranch: number
  idCustomer?: number
  invoiceType: string
  paid: number
  shippingCost?: number
  customerNotes?: string
  products: iSaleProduct[]
}

// Custom request to type sales create controllers
export interface iSaleCommonRequest extends Request {
  body: iSaleRequest
}
