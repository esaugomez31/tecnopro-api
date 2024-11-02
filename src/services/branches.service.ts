import { v4 as uuidv4 } from 'uuid'
import { Like } from 'typeorm'
import { BranchModel, CountryModel, DepartmentModel, MunicipalityModel } from '../models'
import { logger } from '../helpers'
import {
  iFilterSettings,
  iGetBranchByIdResponse,
  iGetBranchesResponse,
  iBranchQueryParams,
  iBranchFilters
} from '../interfaces'
import {
  IDBranchMunicipalityNotFoundError,
  IDBranchCountryNotFoundError,
  IDBranchDepartmentNotFoundError
} from '../errors/branch.factory'

export const branchCreate = async (branch: BranchModel): Promise<BranchModel> => {
  try {
    // Searching for name matches
    await existValuesValidations(
      branch.idCountry,
      branch.idDepartment,
      branch.idMunicipality
    )

    // Generate UUID
    branch.uuid = uuidv4()
    // Create branch
    const createdBranch = await BranchModel.save(branch)
    return createdBranch
  } catch (error) {
    logger.error('Create branch: ' + (error as Error).name)
    throw error
  }
}

export const branchUpdate = async (branch: BranchModel, idBranch: number): Promise<BranchModel> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idBranch),
      existValuesValidations(
        branch.idCountry,
        branch.idDepartment,
        branch.idMunicipality
      )
    ])

    // update branch
    const updatedBranch = await BranchModel.save({
      idBranch, ...branch
    })
    return updatedBranch
  } catch (error) {
    logger.error('Update branch: ' + (error as Error).name)
    throw error
  }
}

export const branchUpdateStatus = async (idBranch: number, status: boolean): Promise<BranchModel> => {
  try {
    // Existing branch
    await existIdValidation(idBranch)

    // update branch status
    const updatedBranch = await BranchModel.save({
      idBranch, status
    })
    return updatedBranch
  } catch (error) {
    logger.error('Update branch status: ' + (error as Error).name)
    throw error
  }
}

export const branchGetAll = async (filterParams: iBranchFilters, settings: iFilterSettings): Promise<iGetBranchesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [branches, totalCount] = await Promise.all([
      BranchModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      BranchModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: branches,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get branches: ' + (error as Error).name)
    throw error
  }
}

export const branchGetById = async (idBranch: number): Promise<iGetBranchByIdResponse> => {
  try {
    const branch = await BranchModel.findOne({
      where: { idBranch }
    })
    return { data: branch ?? {} }
  } catch (error) {
    logger.error('Get branch by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iBranchFilters): iBranchQueryParams => {
  const filters: iBranchQueryParams = {}
  const {
    name,
    description,
    email,
    phoneNumber,
    uuid,
    idCountry,
    idDepartment,
    idMunicipality,
    status
  } = filterParams

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (description !== undefined) {
    filters.description = Like(`%${description}%`)
  }

  if (email !== undefined) {
    filters.email = Like(`%${email}%`)
  }

  if (phoneNumber !== undefined) {
    filters.phoneNumber = Like(`%${phoneNumber}%`)
  }

  if (uuid !== undefined) {
    filters.uuid = uuid
  }

  if (idCountry !== undefined) {
    filters.idCountry = idCountry
  }

  if (idDepartment !== undefined) {
    filters.idDepartment = idDepartment
  }

  if (idMunicipality !== undefined) {
    filters.idMunicipality = idMunicipality
  }

  if (status !== undefined) {
    filters.status = status
  }

  return filters
}

const existValuesValidations = async (idCountry?: number, idDepartment?: number, idMunicipality?: number): Promise<void> => {
  if (idCountry === undefined && idMunicipality === undefined && idDepartment === undefined) return

  const [existCountry, existDepartment, existMunicipality] = await Promise.all([
    idCountry !== undefined
      ? CountryModel.findOne({ select: ['idCountry'], where: { idCountry } })
      : null,
    idDepartment !== undefined
      ? DepartmentModel.findOne({ select: ['idDepartment'], where: { idDepartment } })
      : null,
    idMunicipality !== undefined
      ? MunicipalityModel.findOne({ select: ['idMunicipality'], where: { idMunicipality } })
      : null
  ])

  if (idCountry !== undefined && existCountry === null) {
    throw new IDBranchCountryNotFoundError()
  }

  if (idDepartment !== undefined && existDepartment === null) {
    throw new IDBranchDepartmentNotFoundError()
  }

  if (idMunicipality !== undefined && existMunicipality === null) {
    throw new IDBranchMunicipalityNotFoundError()
  }
}

const existIdValidation = async (idBranch: number): Promise<void> => {
  // Existing branch per ID
  const existBranch = await BranchModel.findOne({
    select: ['idBranch'], where: { idBranch }
  })

  if (existBranch === null) throw new IDBranchMunicipalityNotFoundError()
}
