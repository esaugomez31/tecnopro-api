import { Request } from "express"

import { IPermission, SystemPageEnum } from "."

export enum PermissionPermEnum {
  VIEWLIST = "view_list",
  UPDATE = "update",
}
export interface IRolePermission {
  idRolePermission?: number
  idRole: number | null
  idPermission: number | null
  createdAt?: Date
  updatedAt?: Date
  permission?: IPermission
}

export interface IPermissionObject {
  idPermission: number
}

// Custom request to type Ppermission roles controllers
export interface IRolePermissionCommonRequest extends Request {
  body: {
    permissions: IPermissionObject[]
  }
}

export interface IRolePermissionJoin {
  idRolePermission: number
  idRole: number | null
  idPermission: number | null
  systemPage: SystemPageEnum
  permissionName: string | null
  createdAt?: Date
}

// Unique role response
export interface IGetRolePermissionByIdResponse {
  data: IRolePermissionJoin[]
}
