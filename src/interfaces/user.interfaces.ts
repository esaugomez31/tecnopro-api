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
  idRole?: number
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

// Multi users response interface
export interface iGetUsersResponse {
  data: UserModel[]
  total: number
  page: number
  totalPages: number
}

// Unique user response
export interface iGetUserByIdResponse {
  data: UserModel | {}
}

// Custom request to type users get controllers
export interface iUserGetCustomRequest extends Request {
  query: iUserFilters & iFilterSettings & ParsedQs
}

// Custom request to type users signup controllers
export interface iUserCommonRequest extends Request {
  body: Omit<UserModel, OrmOperationAttributes> & ParsedQs
}
