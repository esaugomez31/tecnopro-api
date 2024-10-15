import { PermissionModel } from '../models'

export const hasPermission = (permissions: PermissionModel[], permissionName: string): boolean => {
  return permissions.some(permission => permission.permissionName === permissionName)
}
