import { Request } from 'express'
import { RolePermissionModel } from '../models'
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
