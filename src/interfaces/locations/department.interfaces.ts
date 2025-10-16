import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings, ICountry, IMunicipality } from "../index"

// Main country interface
export interface IDepartment {
  idDepartment?: number
  name: string
  zipCode?: string
  dteCode?: string
  idCountry: number
  country?: ICountry
  municipalities?: IMunicipality[]
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

// Allow filter params from API
export interface IDepartmentFilters {
  name?: string
  idCountry?: number
  dteCode?: string
  zipCode?: string
  status?: boolean
}

// Filter options to department in typeorm
export interface IDepartmentQueryParams
  extends Omit<IDepartmentFilters, "name" | "zipCode"> {
  name?: FindOperator<string> | string
  zipCode?: FindOperator<string> | string
}

// Multi Departments response interface
export interface IGetDepartmentsResponse {
  data: IDepartment[]
  total: number
  page: number
  totalPages: number
}

// Unique department response
export interface IGetDepartmentByIdResponse {
  data: IDepartment | null
}

// Custom request to type departments get controllers
export interface IDepartmentGetCustomRequest extends Request {
  query: IDepartmentFilters & IFilterSettings & ParsedQs
}

// Custom request to type departments create controllers
export interface IDepartmentCommonRequest extends Request {
  body: IDepartment
}
