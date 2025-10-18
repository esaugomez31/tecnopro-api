import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings } from "../filter.interfaces"

// Main country interface
export interface ICountry {
  idCountry?: number
  name: string
  code?: string | null
  zipCode?: string | null
  timeZone?: string | null
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

// Allow filter params from API
export interface ICountryFilters {
  name?: string
  code?: string
  zipCode?: string
  status?: boolean
}

// Filter options to country in typeorm
export interface ICountryQueryParams
  extends Omit<ICountryFilters, "name" | "code" | "zipCode"> {
  name?: FindOperator<string> | string
  code?: FindOperator<string> | string
  zipCode?: FindOperator<string> | string
}

// Multi Countries response interface
export interface IGetCountriesResponse {
  data: ICountry[]
  total: number
  page: number
  totalPages: number
}

// Unique country response
export interface IGetCountryByIdResponse {
  data: ICountry | null
}

// Custom request to type countries get controllers
export interface ICountryGetCustomRequest extends Request {
  query: ICountryFilters & IFilterSettings & ParsedQs
}

// Custom request to type countries create controllers
export interface ICountryCommonRequest extends Request {
  body: ICountry
}
