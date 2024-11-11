import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { CategoryModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
import { OrmOperationAttributes } from './orm.interfaces'

export enum CategoryPermEnum {
  VIEWLIST = 'view_list',
  CREATE = 'create',
  UPDATE = 'update',
  UPDATESTATUS = 'update_status',
}

// Allow filter params from API
export interface iCategoryFilters {
  name?: string
  description?: string
  uuid?: string
  status?: boolean
}

// Filter options to category in typeorm
export interface iCategoryQueryParams extends Omit<iCategoryFilters, 'name' | 'description'> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
}

// Multi categories response interface
export interface iGetCategoriesResponse {
  data: CategoryModel[]
  total: number
  page: number
  totalPages: number
}

// Unique category response
export interface iGetCategoryByIdResponse {
  data: CategoryModel | null
}

// Custom request to type categories get controllers
export interface iCategoryGetCustomRequest extends Request {
  query: iCategoryFilters & iFilterSettings & ParsedQs
}

// Custom request to type categories create controllers
export interface iCategoryCommonRequest extends Request {
  body: Omit<CategoryModel, OrmOperationAttributes> & ParsedQs
}
