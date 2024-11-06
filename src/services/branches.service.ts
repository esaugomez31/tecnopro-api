import { v4 as uuidv4 } from 'uuid'
import { Like } from 'typeorm'
import { BranchModel, CountryModel, DepartmentModel, MunicipalityModel } from '../models'
import { logger } from '../helpers'
import {
  iFilterSettings,
  iGetBranchByIdResponse,
  iGetBranchesResponse,
  iBranchQueryParams,
  iBranchResponse,
  iBranchFilters
} from '../interfaces'
import {
  IDBranchMunicipalityNotFoundError,
  IDBranchCountryNotFoundError,
  IDBranchDepartmentNotFoundError,
  IDBranchNotFoundError
} from '../errors/branch.error'

export const branchCreate = async (branch: BranchModel): Promise<iBranchResponse | {}> => {
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

    // return db response
    const getBranch = await BranchModel.findOne({
      where: { idBranch: createdBranch.idBranch }
    })

    return getBranch !== null ? getBranchPayload(getBranch) : {}
  } catch (error) {
    logger.error('Create branch: ' + (error as Error).name)
    throw error
  }
}

export const branchUpdate = async (branch: BranchModel, idBranch: number): Promise<iBranchResponse | {}> => {
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

    // return db response
    const getBranch = await BranchModel.findOne({
      where: { idBranch: updatedBranch.idBranch }
    })

    return getBranch !== null ? getBranchPayload(getBranch) : {}
  } catch (error) {
    logger.error('Update branch: ' + (error as Error).name)
    throw error
  }
}

export const branchUpdateStatus = async (idBranch: number, status: boolean): Promise<BranchModel | {}> => {
  try {
    // Existing branch
    await existIdValidation(idBranch)

    // update branch status
    const updatedBranch = await BranchModel.save({
      idBranch, status
    })

    // return db response
    const getBranch = await BranchModel.findOne({
      where: { idBranch: updatedBranch.idBranch }
    })
    return getBranch !== null ? getBranchPayload(getBranch) : {}
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

    const response: iBranchResponse[] = branches.map(branch => getBranchPayload(branch))

    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: response,
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

    return { data: branch !== null ? getBranchPayload(branch) : {} }
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
      ? DepartmentModel.findOne({ select: ['idDepartment'], where: { idCountry, idDepartment } })
      : null,
    idMunicipality !== undefined
      ? MunicipalityModel.findOne({ select: ['idMunicipality'], where: { idCountry, idDepartment, idMunicipality } })
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

  if (existBranch === null) throw new IDBranchNotFoundError()
}

const getBranchPayload = (branch?: BranchModel): iBranchResponse => {
  return {
    idBranch: branch?.idBranch,
    name: branch?.name,
    description: branch?.description,
    phoneNumber: branch?.phoneNumber,
    email: branch?.email,
    address: branch?.address,
    idCountry: branch?.idCountry,
    idDepartment: branch?.idDepartment,
    idMunicipality: branch?.idMunicipality,
    dte: {
      dteActive: branch?.dteActive,
      dteEnvironment: branch?.dteEnvironment,
      // dteApiJwt: branch?.dteApiJwt,
      // dteApiJwtDate: branch?.dteApiJwtDate,
      dteSenderNit: branch?.dteSenderNit,
      dteSenderNrc: branch?.dteSenderNrc,
      dteSenderEmail: branch?.dteSenderEmail,
      dteSenderPhone: branch?.dteSenderPhone,
      dteActivityCode: branch?.dteActivityCode,
      dteActivityDesc: branch?.dteActivityDesc,
      dteSenderName: branch?.dteSenderName,
      dteSenderTradeName: branch?.dteSenderTradeName,
      dteEstablishment: branch?.dteEstablishment
    }
  }
}
