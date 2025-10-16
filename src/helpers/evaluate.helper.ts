import { IPermission } from "../interfaces"

export const hasPermission = (
  permissions: IPermission[],
  permissionName: string,
): boolean => {
  return permissions.some((permission) => permission.permissionName === permissionName)
}

export const isValidValue = <T>(value: T | null | undefined): value is T =>
  value !== undefined && value !== null
