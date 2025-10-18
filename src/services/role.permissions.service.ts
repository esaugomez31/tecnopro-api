import { RolePermissionModel } from "../models"
import { getLocalDateTimeNow, logger } from "../helpers"
import { IDRoleNotFoundError } from "../errors/role.error"
import {
  IPermission,
  SystemPageEnum,
  IRolePermission,
  IPermissionObject,
  IRolePermissionJoin,
  IGetRolePermissionByIdResponse,
} from "../interfaces"

import { roleGetById } from "."

export const rolePermissionUpdate = async (
  permissions: IPermissionObject[],
  idRole: number,
): Promise<IRolePermission[]> => {
  try {
    // Existing role
    await existValuesValidations(idRole)

    // Delete current role permissions
    await RolePermissionModel.delete({ idRole })

    const permissionsBulk: RolePermissionModel[] = []
    // creation date time
    const createdAt = new Date(getLocalDateTimeNow())
    // Creating bulk role permission object
    permissions.forEach(({ idPermission }: IPermissionObject) => {
      const perm = new RolePermissionModel()

      perm.idRole = idRole
      perm.idPermission = idPermission
      perm.createdAt = createdAt

      permissionsBulk.push(perm)
    })

    // update role permission
    const updatedRole = await RolePermissionModel.save(permissionsBulk)
    return updatedRole
  } catch (error) {
    logger.error("Update role permission: " + (error as Error).name)
    throw error
  }
}

export const rolePermissionGetById = async (
  idRole: number,
): Promise<IGetRolePermissionByIdResponse> => {
  try {
    const rolePermissions = await RolePermissionModel.find({
      relations: ["permission"],
      where: { idRole },
    })

    const formattedResult: IRolePermissionJoin[] = rolePermissions.map(
      (rolePermission: IRolePermission) => ({
        idRolePermission: rolePermission.idRolePermission as number,
        idRole: rolePermission.idRole,
        idPermission: rolePermission.idPermission,
        systemPage: rolePermission.permission!.systemPage,
        permissionName: rolePermission.permission?.permissionName ?? null,
        createdAt: rolePermission.createdAt,
      }),
    )
    return { data: formattedResult ?? [] }
  } catch (error) {
    logger.error("Get role permission by idRole: " + (error as Error).name)
    throw error
  }
}

export const getRolePermissionsByPage = async (
  idRole: number,
  systemPage: SystemPageEnum,
): Promise<IPermission[]> => {
  const rolePermissions = await RolePermissionModel.find({
    where: { idRole, permission: { systemPage } },
    relations: ["permission"],
  })

  const permissions: IPermission[] = rolePermissions
    .map((rolePermission) => rolePermission.permission!)
    .filter(Boolean) as IPermission[]

  return permissions
}

const existValuesValidations = async (idRole: number): Promise<void> => {
  const [existRole] = await Promise.all([roleGetById(idRole)])

  if (existRole?.data === null) {
    throw new IDRoleNotFoundError()
  }
}
