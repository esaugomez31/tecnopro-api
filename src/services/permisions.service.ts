import { RolePermissionModel, systemPageEnum } from '../models'

export const getRolePermissions = async (idRole: number, systemPage: systemPageEnum): Promise<RolePermissionModel[]> => {
  const rolePermissions = await RolePermissionModel.find({
    where: { idRole, permissionDetail: { systemPage } },
    relations: ['permissionDetail']
  })

  return rolePermissions
}
