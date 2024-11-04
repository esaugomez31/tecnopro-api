import { Request } from 'express'
import { RolePermissionModel } from '../models'
import { OrmOperationAttributes } from './orm.interfaces'

export enum PermissionPermEnum {
  VIEWLIST = 'view_list',
  UPDATE = 'update'
}

export enum SystemPageEnum {
  BRANCHES = 'branches',
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  BRANDS = 'brands',
  SALES = 'sales',
  SALES_HISTORY = 'sales_history',
  CUSTOMERS = 'customers',
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions'
}

export interface iRolePermission extends Omit<RolePermissionModel, OrmOperationAttributes> {}

export interface iPermissionObject {
  idPermission: number
}

// Custom request to type Ppermission roles controllers
export interface iRolePermissionCommonRequest extends Request {
  body: {
    permissions: iPermissionObject[]
  }
}

export interface iRolePermissionJoin {
  idRolePermission: number
  idRole: number
  idPermission: number
  systemPage: SystemPageEnum
  permissionName: string
  createdAt?: Date
}

// Unique role response
export interface iGetRolePermissionByIdResponse {
  data: iRolePermissionJoin[]
}
