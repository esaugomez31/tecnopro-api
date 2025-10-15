import { FindOperator } from "typeorm"
import { Request } from "express"
import { ParsedQs } from "qs"

import { IFilterSettings, IDepartment } from "../index"

// Main municipality interface
export interface IMunicipality {
  idMunicipality?: number
  name: string
  zipCode?: string
  dteCode?: string
  idCountry?: number
  idDepartment: number
  department?: IDepartment
  createdAt: Date
  updatedAt: Date
  status?: boolean
}

// Allow filter params from API
export interface IMunicipalityFilters {
  name?: string
  idCountry?: number
  idDepartment?: number
  dteCode?: string
  zipCode?: string
  status?: boolean
}

// Filter options to municipality in typeorm
export interface IMunicipalityQueryParams
  extends Omit<IMunicipalityFilters, "name" | "zipCode"> {
  name?: FindOperator<string> | string
  zipCode?: FindOperator<string> | string
}

// Multi municipalities response interface
export interface IGetMunicipalitiesResponse {
  data: IMunicipality[]
  total: number
  page: number
  totalPages: number
}

// Unique municipality response
export interface IGetMunicipalityByIdResponse {
  data: IMunicipality | null
}

// Custom request to type municipalities get controllers
export interface IMunicipalityGetCustomRequest extends Request {
  query: IMunicipalityFilters & IFilterSettings & ParsedQs
}

// Custom request to type municipalities create controllers
export interface IMunicipalityCommonRequest extends Request {
  body: IMunicipality
}
