import { DepartmentModel } from '../../models'
import { logger, applyFilter } from '../../helpers'
import { countryGetById } from './countries.service'
import {
  iFilterSettings,
  iGetDepartmentByIdResponse,
  iGetDepartmentsResponse,
  iDepartmentQueryParams,
  iDepartmentFilters
} from '../../interfaces'
import {
  IDDepartmentNotFoundError,
  DepartmentCodeExistsError,
  IDDepCountryNotFoundError,
  NameExistsError
} from '../../errors/locations/department.factory'

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
    const relations = getDepartmentIncludeFields(settings.include)

    const [departments, totalCount] = await Promise.all([
      DepartmentModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order,
        relations
      }),
      DepartmentModel.count({ where: filters, relations })
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

export const departmentGetById = async (idDepartment: number, settings?: iFilterSettings): Promise<iGetDepartmentByIdResponse> => {
  try {
    const relations = settings !== undefined ? getDepartmentIncludeFields(settings.include) : []
    const department = await DepartmentModel.findOne({
      where: { idDepartment }, relations
    })
    return { data: department }
  } catch (error) {
    logger.error('Get department by id: ' + (error as Error).name)
    throw error
  }
}

const getDepartmentIncludeFields = (includes?: string[]): string[] => {
  const relations = []
  if (includes !== undefined) {
    if (includes.includes('municipalities')) {
      relations.push('municipalities')
    }
  }
  return relations
}

const getFilters = (params: iDepartmentFilters): iDepartmentQueryParams => {
  const filters: iDepartmentQueryParams = {}

  applyFilter(filters, 'name', params.name, true)
  applyFilter(filters, 'zipCode', params.zipCode, true)
  applyFilter(filters, 'dteCode', params.dteCode)
  applyFilter(filters, 'idCountry', params.idCountry)
  applyFilter(filters, 'status', params.status)

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
    idCountry !== undefined ? countryGetById(idCountry) : null
  ])

  if (idCountry !== undefined && existCountry?.data === null) {
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
  const existDepartment = await departmentGetById(idDepartment)

  if (existDepartment.data === null) throw new IDDepartmentNotFoundError()
}
