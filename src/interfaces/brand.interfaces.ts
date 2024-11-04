import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { BrandModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
import { OrmOperationAttributes } from './orm.interfaces'

export enum BrandPermEnum {
  VIEWLIST = 'view_list',
  CREATE = 'create',
  UPDATE = 'update',
  UPDATESTATUS = 'update_status',
}

// Allow filter params from API
export interface iBrandFilters {
  name?: string
  description?: string
  uuid?: string
  status?: boolean
}

// Filter options to brand in typeorm
export interface iBrandQueryParams extends Omit<iBrandFilters, 'name' | 'description'> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
}

// Multi Brands response interface
export interface iGetBrandsResponse {
  data: BrandModel[]
  total: number
  page: number
  totalPages: number
}

// Unique brand response
export interface iGetBrandByIdResponse {
  data: BrandModel | {}
}

// Custom request to type brands get controllers
export interface iBrandGetCustomRequest extends Request {
  query: iBrandFilters & iFilterSettings & ParsedQs
}

// Custom request to type brands create controllers
export interface iBrandCommonRequest extends Request {
  body: Omit<BrandModel, OrmOperationAttributes> & ParsedQs
}
