// import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { FindOperator } from 'typeorm'
import { ParsedQs } from 'qs'
import {
  IFilterSettings,
  IUser,
  ICustomer,
  IBranch,
  ISaleDetail
} from '.'

export enum SalePermEnum {
  VIEWLIST = 'view_list',
  CREATE = 'create',
  UPDATESTATUS = 'update_status',
}

// Main sale inteface
export interface ISale {
  idSale?: number
  uuid?: string
  invoiceType: string
  paid: number
  total: number
  vat?: number
  subtotal: number
  totalProfit: number
  grossProfit: number
  usersCommission: number
  shippingCost?: number
  customerNotes?: string
  totalText?: string
  refunded: boolean
  contingencyStatus: boolean
  dteStatus?: string
  dteControlNumber?: string
  dteRequestSentAt?: Date
  dteObservations?: string
  dteOperationCondition?: '1' | '2' | '3'
  dteSeal?: string
  idUser: number
  idCustomer?: number
  idBranch: number
  createdAt?: Date
  updatedAt?: Date
  status?: boolean

  // Relaciones
  user?: IUser
  customer?: ICustomer
  branch?: IBranch
  saleDetails?: ISaleDetail[]
}

// Allow filter params from API
export interface ISaleFilters {
  uuid?: string
  idUser?: number
  idCustomer?: number
  idBranch?: number
  startDate?: string | Date
  endDate?: string | Date
  status?: boolean
}

// Filter options to sale in typeorm
export interface ISaleQueryParams extends ISaleFilters {
  createdAt?: FindOperator<Date>
}
// export interface iSaleQueryParams extends Omit<iSaleFilters, 'startDate' | 'endDate'> {}

// Multi sales response interface
export interface IGetSalesResponse {
  data: ISale[]
  total: number
  page: number
  totalPages: number
}

// Unique sale response
export interface IGetSaleByIdResponse {
  data: ISale | null
}

// Custom request to type sales get controllers
export interface ISaleGetCustomRequest extends Request {
  query: ISaleFilters & IFilterSettings & ParsedQs
}

export interface ISaleTotals {
  total: number
  subtotal: number
  vat: number
  totalProfit: number
  grossProfit: number
  usersCommission: number
  totalText: string
}

export interface ISaleProduct {
  idProduct: number
  price: number
  quantity: number
}

export interface ISaleRequest {
  idBranch: number
  idCustomer?: number
  invoiceType: string
  paid: number
  shippingCost?: number
  customerNotes?: string
  refunded: boolean
  contingencyStatus: boolean
  products: ISaleProduct[]
}

// Custom request to type sales create controllers
export interface ISaleCommonRequest extends Request {
  body: ISaleRequest
}
