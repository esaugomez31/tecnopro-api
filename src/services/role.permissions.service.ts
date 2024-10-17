
import { RolePermissionModel, RoleModel } from '../models'
import { getLocalDateTimeNow, logger } from '../helpers'
import {
  IDRoleNotFoundError
} from '../errors/role.error'
import {
  iPermissionObject
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
    const creationDate = new Date(getLocalDateTimeNow())
    // Creating bulk role permission object
    permissions.forEach(({ idPermission }: iPermissionObject) => {
      const perm = new RolePermissionModel()

      perm.idRole = idRole
      perm.idPermission = idPermission
      perm.creationDate = creationDate

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
