import { Request } from 'express'
import { RolePermissionModel, systemPageEnum } from '../models'
import { OrmOperationAttributes } from './orm.interfaces'

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
  systemPage: systemPageEnum
  permissionName: string
  createdAt?: Date
}

// Unique role response
export interface iGetRolePermissionByIdResponse {
  data: iRolePermissionJoin[]
}
