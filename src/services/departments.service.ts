import { Like } from 'typeorm'
import { DepartmentModel, CountryModel } from '../models'
import { logger } from '../helpers'
import {
  iFilterSettings,
  iGetDepartmentByIdResponse,
  iGetDepartmentsResponse,
  iDepartmentQueryParams,
  iDepartmentFilters
} from '../interfaces'
import {
  IDDepartmentNotFoundError,
  DepartmentCodeExistsError,
  IDDepCountryNotFoundError,
  NameExistsError
} from '../errors/department.factory'

export const departmentCreate = async (department: DepartmentModel): Promise<DepartmentModel> => {
  try {
    // Searching for name matches
    await existValuesValidations(department.name, department.dteCode, department.idCountry)

    // Create department
    const createdDepartment = await DepartmentModel.save(department)
    return createdDepartment
  } catch (error) {
    logger.error('Create department: ' + (error as Error).name)
    throw error
  }
}

export const departmentUpdate = async (department: DepartmentModel, idDepartment: number): Promise<DepartmentModel> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idDepartment),
      existValuesValidations(department.name, department.dteCode, department.idCountry, idDepartment)
    ])

    // update department
    const updatedDepartment = await DepartmentModel.save({
      idDepartment, ...department
    })
    return updatedDepartment
  } catch (error) {
    logger.error('Update department: ' + (error as Error).name)
    throw error
  }
}

export const departmentUpdateStatus = async (idDepartment: number, status: boolean): Promise<DepartmentModel> => {
  try {
    // Existing department
    await existIdValidation(idDepartment)

    // update department status
    const updatedDepartment = await DepartmentModel.save({
      idDepartment, status
    })
    return updatedDepartment
  } catch (error) {
    logger.error('Update department status: ' + (error as Error).name)
    throw error
  }
}

export const departmentGetAll = async (filterParams: iDepartmentFilters, settings: iFilterSettings): Promise<iGetDepartmentsResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [departments, totalCount] = await Promise.all([
      DepartmentModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      DepartmentModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: departments,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get departments: ' + (error as Error).name)
    throw error
  }
}

export const departmentGetById = async (idDepartment: number): Promise<iGetDepartmentByIdResponse> => {
  try {
    const department = await DepartmentModel.findOne({
      where: { idDepartment }
    })
    return { data: department ?? {} }
  } catch (error) {
    logger.error('Get department by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iDepartmentFilters): iDepartmentQueryParams => {
  const filters: iDepartmentQueryParams = {}
  const { name, status, dteCode, zipCode, idCountry } = filterParams

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (dteCode !== undefined) {
    filters.dteCode = dteCode
  }

  if (idCountry !== undefined) {
    filters.idCountry = idCountry
  }

  if (zipCode !== undefined) {
    filters.zipCode = Like(`%${zipCode}%`)
  }

  if (status !== undefined) {
    filters.status = status
  }

  return filters
}

const existValuesValidations = async (name?: string, dteCode?: string, idCountry?: number, idDepartment?: number): Promise<void> => {
  if (name === undefined && dteCode === undefined && idCountry === undefined) return

  const filters: iDepartmentQueryParams[] = [{ name }, { dteCode }]

  const [existDepartment, existCountry] = await Promise.all([
    DepartmentModel.findOne({
      select: ['idDepartment', 'name', 'dteCode'],
      where: filters
    }),
    idCountry !== undefined
      ? CountryModel.findOne({ select: ['idCountry'], where: { idCountry } })
      : null
  ])

  if (idCountry !== undefined && existCountry === null) {
    throw new IDDepCountryNotFoundError()
  }

  if (existDepartment !== null) {
    // Searching for name matches
    if (existDepartment.name === name && existDepartment.idDepartment !== idDepartment) {
      throw new NameExistsError()
    }
    // Searching for code matches
    if (existDepartment.dteCode === dteCode && existDepartment.idDepartment !== idDepartment) {
      throw new DepartmentCodeExistsError()
    }
  }
}

const existIdValidation = async (idDepartment: number): Promise<void> => {
  // Existing department per ID
  const existDepartment = await DepartmentModel.findOne({
    select: ['idDepartment'], where: { idDepartment }
  })

  if (existDepartment === null) throw new IDDepartmentNotFoundError()
}
