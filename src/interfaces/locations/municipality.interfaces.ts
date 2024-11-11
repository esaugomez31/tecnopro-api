import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { MunicipalityModel } from '../../models'
import { iFilterSettings } from '../filter.interfaces'
import { OrmOperationAttributes } from '../orm.interfaces'

// Allow filter params from API
export interface iMunicipalityFilters {
  name?: string
  idCountry?: number
  idDepartment?: number
  dteCode?: string
  zipCode?: string
  status?: boolean
}

// Filter options to municipality in typeorm
export interface iMunicipalityQueryParams extends Omit<iMunicipalityFilters, 'name' | 'zipCode'> {
  name?: FindOperator<string> | string
  zipCode?: FindOperator<string> | string
}

// Multi municipalities response interface
export interface iGetMunicipalitiesResponse {
  data: MunicipalityModel[]
  total: number
  page: number
  totalPages: number
}

// Unique municipality response
export interface iGetMunicipalityByIdResponse {
  data: MunicipalityModel | null
}

// Custom request to type municipalities get controllers
export interface iMunicipalityGetCustomRequest extends Request {
  query: iMunicipalityFilters & iFilterSettings & ParsedQs
}

// Custom request to type municipalities create controllers
export interface iMunicipalityCommonRequest extends Request {
  body: Omit<MunicipalityModel, OrmOperationAttributes> & ParsedQs
}
