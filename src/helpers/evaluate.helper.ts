import { PermissionModel } from '../models'

export const hasPermission = (permissions: PermissionModel[], permissionName: string): boolean => {
  return permissions.some(permission => permission.permissionName === permissionName)
}

export const isValidValue = (value: any): boolean => value !== undefined && value !== null
