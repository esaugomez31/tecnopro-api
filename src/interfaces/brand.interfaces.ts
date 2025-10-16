import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings } from "./filter.interfaces"

export enum BrandPermEnum {
  VIEWLIST = "view_list",
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
}

// Main brand interface
export interface IBrand {
  idBrand?: number
  uuid: string
  name: string
  description: string
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

// Allow filter params from API
export interface IBrandFilters {
  name?: string
  description?: string
  uuid?: string
  status?: boolean
}

// Filter options to brand in typeorm
export interface IBrandQueryParams extends Omit<IBrandFilters, "name" | "description"> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
}

// Multi Brands response interface
export interface IGetBrandsResponse {
  data: IBrand[]
  total: number
  page: number
  totalPages: number
}

// Unique brand response
export interface IGetBrandByIdResponse {
  data: IBrand | null
}

// Custom request to type brands get controllers
export interface IBrandGetCustomRequest extends Request {
  query: IBrandFilters & IFilterSettings & ParsedQs
}

// Custom request to type brands create controllers
export interface IBrandCommonRequest extends Request {
  body: IBrand
}
