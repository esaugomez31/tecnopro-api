import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { UserModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
import { OrmOperationAttributes } from './orm.interfaces'

// JWT interface
export interface iUserJWT {
  idUser: number
  uuid: string | null
  username: string
}

// Allow filter params from API
export interface iUserFilters {
  username?: string
  name?: string
  email?: string
  phoneNumber?: string
  status?: boolean
  idRol?: number
}
// User public info
export interface iUserPublicResponse extends Omit<UserModel, 'password' | 'status' | OrmOperationAttributes> {
  accessToken: string | null
}
// Filter options to use in typeorm
export interface iUserQueryParams extends Omit<iUserFilters, 'username' | 'name' | 'email' | 'phoneNumber'> {
  username?: FindOperator<string> | string
  name?: FindOperator<string> | string
  email?: FindOperator<string> | string
  phoneNumber?: FindOperator<string> | string
}

// Interface for public information on user get data methods
export interface iGetUsersResponse {
  data: UserModel[]
  total: number
  page: number
  totalPages: number
}

// Custom request to type users get controllers
export interface iUserGetCustomRequest extends Request {
  query: iUserFilters & iFilterSettings & ParsedQs
}
// Custom request to type users create controllers
export interface iUserCreateCustomRequest extends Request {
  body: UserModel & ParsedQs
}
