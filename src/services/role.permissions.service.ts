
import { RolePermissionModel, PermissionModel, RoleModel } from '../models'
import { getLocalDateTimeNow, logger } from '../helpers'
import {
  IDRoleNotFoundError
} from '../errors/role.error'
import {
  SystemPageEnum,
  iPermissionObject,
  iRolePermissionJoin,
  iGetRolePermissionByIdResponse
} from '../interfaces/role.permission.interfaces'

export const rolePermissionUpdate = async (permissions: iPermissionObject[], idRole: number): Promise<RolePermissionModel[]> => {
  try {
    // Existing role
    const existRole = await RoleModel.findOne({
      select: ['idRole'], where: { idRole }
    })

    if (existRole === null) throw new IDRoleNotFoundError()

    // Delete current role permissions
    await RolePermissionModel.delete({ idRole })

    const permissionsBulk: RolePermissionModel[] = []
    // creation date time
    const createdAt = new Date(getLocalDateTimeNow())
    // Creating bulk role permission object
    permissions.forEach(({ idPermission }: iPermissionObject) => {
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
    logger.error('Update role permission: ' + (error as Error).name)
    throw error
  }
}

export const rolePermissionGetById = async (idRole: number): Promise<iGetRolePermissionByIdResponse> => {
  try {
    const rolePermissions = await RolePermissionModel.find({
      relations: ['permissionDetail'],
      where: { idRole }
    })

    const formattedResult: iRolePermissionJoin[] = rolePermissions.map((rolePermission: RolePermissionModel) => ({
      idRolePermission: rolePermission.idRolePermission,
      idRole: rolePermission.idRole,
      idPermission: rolePermission.idPermission,
      systemPage: rolePermission.permissionDetail.systemPage,
      permissionName: rolePermission.permissionDetail.permissionName,
      createdAt: rolePermission.createdAt
    }))
    return { data: formattedResult ?? [] }
  } catch (error) {
    logger.error('Get role permission by idRole: ' + (error as Error).name)
    throw error
  }
}

export const getRolePermissionsByPage = async (idRole: number, systemPage: SystemPageEnum): Promise<PermissionModel[]> => {
  const rolePermissions = await RolePermissionModel.find({
    where: { idRole, permissionDetail: { systemPage } },
    relations: ['permissionDetail']
  })

  const permissions: PermissionModel[] = rolePermissions.map(rolePermission => {
    return rolePermission.permissionDetail
  }).filter(Boolean)

  return permissions
}
