import { FindOperator } from "typeorm"
import { Request } from "express"
import { ParsedQs } from "qs"

import { IFilterSettings } from "./filter.interfaces"

export enum UserRoleEnum {
  ADMIN = "admin",
  SUBADMIN = "sub_admin",
  USER = "user",
}

export enum UserPermEnum {
  VIEWLIST = "view_list",
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
}

// Main user interface
export interface IUser {
  idUser?: number
  uuid: string
  name: string
  username: string
  password: string
  phoneNumber: string
  whatsappNumber: string
  email: string
  type?: UserRoleEnum
  notifications: boolean
  lastLogin: Date
  timeZone?: string
  idRole?: number
  createdAt?: Date
  updatedAt?: Date
  status: boolean
}

// JWT interface
export interface IUserJWT {
  idUser: number
  uuid: string | null
  idRole?: number
  type: UserRoleEnum
}

// Allow filter params from API
export interface IUserFilters {
  username?: string
  name?: string
  email?: string
  phoneNumber?: string
  status?: boolean
  idRole?: number
}

// User public info
export interface IUserPublicResponse extends Omit<IUser, "password" | "status"> {}

// Filter options to use in typeorm
export interface IUserQueryParams
  extends Omit<IUserFilters, "username" | "name" | "email" | "phoneNumber"> {
  username?: FindOperator<string> | string
  name?: FindOperator<string> | string
  email?: FindOperator<string> | string
  phoneNumber?: FindOperator<string> | string
}

// Multi users response interface
export interface IGetUsersResponse {
  data: IUser[]
  total: number
  page: number
  totalPages: number
}

// Unique user response
export interface IGetUniqueUser {
  data: IUser | null
}

// Custom request to type users get controllers
export interface IUserGetCustomRequest extends Request {
  query: IUserFilters & IFilterSettings & ParsedQs
}

// Custom request to type users signup controllers
export interface IUserCommonRequest extends Request {
  body: IUser & ParsedQs
}
