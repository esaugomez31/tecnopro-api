import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { RoleModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
import { OrmOperationAttributes } from './orm.interfaces'

export enum RolePermEnum {
  VIEWLIST = 'view_list',
  CREATE = 'create',
  UPDATE = 'update',
  UPDATESTATUS = 'update_status',
}

// Allow filter params from API
export interface iRoleFilters {
  name?: string
  status?: boolean
}

// Filter options to role in typeorm
export interface iRoleQueryParams extends Omit<iRoleFilters, 'name'> {
  name?: FindOperator<string> | string
}

// Multi roles response interface
export interface iGetRolesResponse {
  data: RoleModel[]
  total: number
  page: number
  totalPages: number
}

// Unique role response
export interface iGetRoleByIdResponse {
  data: RoleModel | null
}

// Custom request to type roles get controllers
export interface iRoleGetCustomRequest extends Request {
  query: iRoleFilters & iFilterSettings & ParsedQs
}

// Custom request to type roles create controllers
export interface iRoleCommonRequest extends Request {
  body: Omit<RoleModel, OrmOperationAttributes> & ParsedQs
}
