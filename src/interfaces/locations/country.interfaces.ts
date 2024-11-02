import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { CountryModel } from '../../models'
import { iFilterSettings } from '../filter.interfaces'
import { OrmOperationAttributes } from '../orm.interfaces'

// Allow filter params from API
export interface iCountryFilters {
  name?: string
  code?: string
  zipCode?: string
  status?: boolean
}

// Filter options to country in typeorm
export interface iCountryQueryParams extends Omit<iCountryFilters, 'name' | 'code' | 'zipCode'> {
  name?: FindOperator<string> | string
  code?: FindOperator<string> | string
  zipCode?: FindOperator<string> | string
}

// Multi Countries response interface
export interface iGetCountriesResponse {
  data: CountryModel[]
  total: number
  page: number
  totalPages: number
}

// Unique country response
export interface iGetCountryByIdResponse {
  data: CountryModel | {}
}

// Custom request to type countries get controllers
export interface iCountryGetCustomRequest extends Request {
  query: iCountryFilters & iFilterSettings & ParsedQs
}

// Custom request to type countries create controllers
export interface iCountryCommonRequest extends Request {
  body: Omit<CountryModel, OrmOperationAttributes> & ParsedQs
}
