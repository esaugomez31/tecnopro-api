import { iFilterParams } from './filter.interfaces'
import { FindOperator } from 'typeorm'

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

export interface iUserPublicResponse {
  idUser: number
  uuid: string | null
  name: string
  username: string
  email: string | null
  owner: boolean
  phoneNumber: string | null
  whatsappNumber: string | null
  notifications?: boolean
  lastLogin: Date | null
  timeZone: string | null
  idRol?: number | null
  accessToken: string | null
}

export interface iUserJWT {
  idUser: number
  uuid: string | null
  username: string
}

export interface iUserFilters {
  username?: string
  name?: string
  email?: string
  idRol?: number
}

export interface iUserQueryParams {
  username?: FindOperator<string> | string
  name?: FindOperator<string> | string
  email?: FindOperator<string> | string
  idRol?: number
}

export interface iUserFilterParams extends iFilterParams, iUserFilters {}
