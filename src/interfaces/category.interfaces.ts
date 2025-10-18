import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings } from "./filter.interfaces"

export enum CategoryPermEnum {
  VIEWLIST = "view_list",
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
}

// Main category interface
export interface ICategory {
  idCategory?: number
  uuid?: string | null
  name: string
  description?: string | null
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

// Allow filter params from API
export interface ICategoryFilters {
  name?: string
  description?: string
  uuid?: string
  status?: boolean
}

// Filter options to category in typeorm
export interface ICategoryQueryParams
  extends Omit<ICategoryFilters, "name" | "description"> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
}

// Multi categories response interface
export interface IGetCategoriesResponse {
  data: ICategory[]
  total: number
  page: number
  totalPages: number
}

// Unique category response
export interface IGetCategoryByIdResponse {
  data: ICategory | null
}

// Custom request to type categories get controllers
export interface ICategoryGetCustomRequest extends Request {
  query: ICategoryFilters & IFilterSettings & ParsedQs
}

// Custom request to type categories create controllers
export interface ICategoryCommonRequest extends Request {
  body: ICategory
}
