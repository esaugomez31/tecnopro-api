import { FindOperator } from 'typeorm'
import { Request } from 'express'
import { ParsedQs } from 'qs'
import { UserModel } from '../models'
import { iFilterSettings } from './filter.interfaces'
export interface iCreateUserDto {
  name: string
  username: string
  password: string
  email?: string
  phoneNumber?: string
  whatsappNumber?: string
  notifications?: boolean
  idRol?: number | null
}
export interface iUserCreateCustomRequest extends Request {
  body: UserModel & ParsedQs
}

export interface iUserPublicResponse {
  idUser?: number
  uuid: string | null
  name: string
  username: string
  email: string | null
  owner: boolean
  phoneNumber: string | null
  whatsappNumber: string | null
  notifications?: boolean
  lastLogin: Date | null
  timeZone?: string | null
  idRol?: number | null
  accessToken: string | null
}

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

// Filter options to use in typeorm
export interface iUserQueryParams {
  username?: FindOperator<string> | string
  name?: FindOperator<string> | string
  email?: FindOperator<string> | string
  phoneNumber?: FindOperator<string> | string
  status?: boolean
  idRol?: number
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
