import { v4 as uuidv4 } from 'uuid'
import { BranchModel } from '../models'
import { logger, applyFilter } from '../helpers'
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
import {
  countryGetById,
  departmentGetById,
  municipalityGetById
} from './locations'

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

    return { data: branch !== null ? getBranchPayload(branch) : null }
  } catch (error) {
    logger.error('Get branch by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (params: iBranchFilters): iBranchQueryParams => {
  const filters: iBranchQueryParams = {}

  applyFilter(filters, 'name', params.name, true)
  applyFilter(filters, 'description', params.description, true)
  applyFilter(filters, 'email', params.email, true)
  applyFilter(filters, 'phoneNumber', params.phoneNumber, true)
  applyFilter(filters, 'uuid', params.uuid)
  applyFilter(filters, 'idCountry', params.idCountry)
  applyFilter(filters, 'idDepartment', params.idDepartment)
  applyFilter(filters, 'idMunicipality', params.idMunicipality)
  applyFilter(filters, 'status', params.status)

  return filters
}

const existValuesValidations = async (idCountry?: number, idDepartment?: number, idMunicipality?: number): Promise<void> => {
  const ids = [idCountry, idDepartment, idMunicipality]
  if (!ids.some(id => id !== undefined)) return

  const [existCountry, existDepartment, existMunicipality] = await Promise.all([
    idCountry !== undefined ? countryGetById(idCountry) : null,
    idDepartment !== undefined ? departmentGetById(idDepartment) : null,
    idMunicipality !== undefined ? municipalityGetById(idMunicipality) : null
  ])

  if (idCountry !== undefined && existCountry?.data === null) {
    throw new IDBranchCountryNotFoundError()
  }

  if (idDepartment !== undefined && existDepartment?.data === null) {
    throw new IDBranchDepartmentNotFoundError()
  }

  if (idMunicipality !== undefined && existMunicipality?.data === null) {
    throw new IDBranchMunicipalityNotFoundError()
  }
}

const existIdValidation = async (idBranch: number): Promise<void> => {
  // Existing branch per ID
  const existBranch = await branchGetById(idBranch)

  if (existBranch.data === null) throw new IDBranchNotFoundError()
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
    vatEnabled: branch?.vatEnabled,
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
