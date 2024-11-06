import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { ProductModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
import { OrmOperationAttributes } from './orm.interfaces'

export enum ProductPermEnum {
  VIEWLIST = 'view_list',
  CREATE = 'create',
  UPDATE = 'update',
  UPDATESTATUS = 'update_status',
  SEEPURCHASEDATA = 'see_purchase_data',
  UPDTPURCHASEDATA = 'update_purchase_data',
  UPDTCOMMISSIONS = 'update_commissions',
  UPDTSTOCK = 'update_stock',
  UPDTPRICE = 'update_price'
}

// Allow filter params from API
export interface iProductFilters {
  name?: string
  description?: string
  uuid?: string
  location?: string
  code?: string
  barcode?: string
  idBranch?: number
  idBrand?: number
  idCategory?: number
  idUser?: number
  status?: boolean
}

// Filter options to product in typeorm
export interface iProductQueryParams extends Omit<iProductFilters, 'name' | 'description' | 'location' | 'code'> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
  location?: FindOperator<string> | string
  code?: FindOperator<string> | string
}

// Multi products response interface
export interface iGetProductsResponse {
  data: ProductModel[]
  total: number
  page: number
  totalPages: number
}

// Unique product response
export interface iGetProductByIdResponse {
  data: ProductModel | {}
}

// Custom request to type products get controllers
export interface iProductGetCustomRequest extends Request {
  query: iProductFilters & iFilterSettings & ParsedQs
}

// Custom request to type products create controllers
export interface iProductCommonRequest extends Request {
  body: Omit<ProductModel, OrmOperationAttributes> & ParsedQs
}
