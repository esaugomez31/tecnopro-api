import { Like } from 'typeorm'
import { RoleModel } from '../models'
import { logger } from '../helpers'
import {
  iFilterSettings,
  iGetRoleByIdResponse,
  iGetRolesResponse,
  iRoleQueryParams,
  iRoleFilters
} from '../interfaces'
import {
  IDRoleNotFoundError,
  NameExistsError
} from '../errors/role.error'

export const roleCreate = async (role: RoleModel): Promise<RoleModel> => {
  try {
    // Searching for name matches
    await roleRequitedValidations(role.name)

    // Create role
    const createdRole = await RoleModel.save(role)
    return createdRole
  } catch (error) {
    logger.error('Create role: ' + (error as Error).name)
    throw error
  }
}

export const roleUpdate = async (role: RoleModel, idRole: number): Promise<RoleModel> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idRole),
      roleRequitedValidations(role.name, idRole)
    ])

    // update role
    const updatedRole = await RoleModel.save({
      idRole, ...role
    })
    return updatedRole
  } catch (error) {
    logger.error('Update role: ' + (error as Error).name)
    throw error
  }
}

export const roleUpdateStatus = async (idRole: number, status: boolean): Promise<RoleModel> => {
  try {
    // Existing role
    await existIdValidation(idRole)

    // update role status
    const updatedRole = await RoleModel.save({
      idRole, status
    })
    return updatedRole
  } catch (error) {
    logger.error('Update role status: ' + (error as Error).name)
    throw error
  }
}

export const roleGetAll = async (filterParams: iRoleFilters, settings: iFilterSettings): Promise<iGetRolesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [roles, totalCount] = await Promise.all([
      RoleModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      RoleModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: roles,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get roles: ' + (error as Error).name)
    throw error
  }
}

export const roleGetById = async (idRole: number): Promise<iGetRoleByIdResponse> => {
  try {
    const role = await RoleModel.findOne({
      where: { idRole }
    })
    return { data: role ?? {} }
  } catch (error) {
    logger.error('Get role by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iRoleFilters): iRoleQueryParams => {
  const filters: iRoleQueryParams = {}
  const { name, status } = filterParams

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (status !== undefined) {
    filters.status = status
  }

  return filters
}

const roleRequitedValidations = async (name?: string, idRole?: number): Promise<void> => {
  if (name === undefined) return

  const filters: iRoleQueryParams[] = [{ name }]

  const existRole = await RoleModel.findOne({
    select: ['idRole', 'name'],
    where: filters
  })

  if (existRole !== null) {
    // Searching for name matches
    if (existRole.name === name && existRole.idRole !== idRole) {
      throw new NameExistsError()
    }
  }
}

const existIdValidation = async (idRole: number): Promise<void> => {
  // Existing role
  const existRole = await RoleModel.findOne({
    select: ['idRole'], where: { idRole }
  })

  if (existRole === null) throw new IDRoleNotFoundError()
}
