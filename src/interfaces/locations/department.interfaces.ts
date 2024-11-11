import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { DepartmentModel } from '../../models'
import { iFilterSettings } from '../filter.interfaces'
import { OrmOperationAttributes } from '../orm.interfaces'

// Allow filter params from API
export interface iDepartmentFilters {
  name?: string
  idCountry?: number
  dteCode?: string
  zipCode?: string
  status?: boolean
}

// Filter options to department in typeorm
export interface iDepartmentQueryParams extends Omit<iDepartmentFilters, 'name' | 'zipCode'> {
  name?: FindOperator<string> | string
  zipCode?: FindOperator<string> | string
}

// Multi Departments response interface
export interface iGetDepartmentsResponse {
  data: DepartmentModel[]
  total: number
  page: number
  totalPages: number
}

// Unique department response
export interface iGetDepartmentByIdResponse {
  data: DepartmentModel | null
}

// Custom request to type departments get controllers
export interface iDepartmentGetCustomRequest extends Request {
  query: iDepartmentFilters & iFilterSettings & ParsedQs
}

// Custom request to type departments create controllers
export interface iDepartmentCommonRequest extends Request {
  body: Omit<DepartmentModel, OrmOperationAttributes> & ParsedQs
}
