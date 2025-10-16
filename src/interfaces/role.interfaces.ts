import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings } from "./filter.interfaces"

export enum RolePermEnum {
  VIEWLIST = "view_list",
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
}

// Main role interface
export interface IRole {
  idRole?: number
  name: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
  status: boolean
}

// Allow filter params from API
export interface IRoleFilters {
  name?: string
  status?: boolean
}

// Filter options to role in typeorm
export interface IRoleQueryParams extends Omit<IRoleFilters, "name"> {
  name?: FindOperator<string> | string
}

// Multi roles response interface
export interface IGetRolesResponse {
  data: IRole[]
  total: number
  page: number
  totalPages: number
}

// Unique role response
export interface IGetRoleByIdResponse {
  data: IRole | null
}

// Custom request to type roles get controllers
export interface IRoleGetCustomRequest extends Request {
  query: IRoleFilters & IFilterSettings & ParsedQs
}

// Custom request to type roles create controllers
export interface IRoleCommonRequest extends Request {
  body: IRole
}
