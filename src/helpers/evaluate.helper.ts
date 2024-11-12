import { IPermission } from '../interfaces'

export const hasPermission = (permissions: IPermission[], permissionName: string): boolean => {
  return permissions.some(permission => permission.permissionName === permissionName)
}

export const isValidValue = (value: any): boolean => value !== undefined && value !== null
