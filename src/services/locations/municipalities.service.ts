import { Like } from 'typeorm'
import { MunicipalityModel, CountryModel, DepartmentModel } from '../../models'
import { logger } from '../../helpers'
import {
  iFilterSettings,
  iGetMunicipalityByIdResponse,
  iGetMunicipalitiesResponse,
  iMunicipalityQueryParams,
  iMunicipalityFilters
} from '../../interfaces'
import {
  IDMunicipalityNotFoundError,
  // MunicipalityCodeExistsError,
  IDMuniCountryNotFoundError,
  IDMuniDepartmentNotFoundError,
  NameExistsError
} from '../../errors/locations/municipality.factory'

export const municipalityCreate = async (municipality: MunicipalityModel): Promise<MunicipalityModel> => {
  try {
    // Searching for name matches
    await existValuesValidations(
      municipality.name,
      municipality.dteCode,
      municipality.idCountry,
      municipality.idDepartment
    )

    // Create municipality
    const createdMunicipality = await MunicipalityModel.save(municipality)
    return createdMunicipality
  } catch (error) {
    logger.error('Create municipality: ' + (error as Error).name)
    throw error
  }
}

export const municipalityUpdate = async (municipality: MunicipalityModel, idMunicipality: number): Promise<MunicipalityModel> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idMunicipality),
      existValuesValidations(
        municipality.name,
        municipality.dteCode,
        municipality.idCountry,
        municipality.idDepartment,
        idMunicipality
      )
    ])

    // update municipality
    const updatedMunicipality = await MunicipalityModel.save({
      idMunicipality, ...municipality
    })
    return updatedMunicipality
  } catch (error) {
    logger.error('Update municipality: ' + (error as Error).name)
    throw error
  }
}

export const municipalityUpdateStatus = async (idMunicipality: number, status: boolean): Promise<MunicipalityModel> => {
  try {
    // Existing municipality
    await existIdValidation(idMunicipality)

    // update municipality status
    const updatedMunicipality = await MunicipalityModel.save({
      idMunicipality, status
    })
    return updatedMunicipality
  } catch (error) {
    logger.error('Update municipality status: ' + (error as Error).name)
    throw error
  }
}

export const municipalityGetAll = async (filterParams: iMunicipalityFilters, settings: iFilterSettings): Promise<iGetMunicipalitiesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [municipalities, totalCount] = await Promise.all([
      MunicipalityModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      MunicipalityModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: municipalities,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get municipalities: ' + (error as Error).name)
    throw error
  }
}

export const municipalityGetById = async (idMunicipality: number): Promise<iGetMunicipalityByIdResponse> => {
  try {
    const municipality = await MunicipalityModel.findOne({
      where: { idMunicipality }
    })
    return { data: municipality ?? {} }
  } catch (error) {
    logger.error('Get municipality by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iMunicipalityFilters): iMunicipalityQueryParams => {
  const filters: iMunicipalityQueryParams = {}
  const { name, status, dteCode, zipCode, idCountry, idDepartment } = filterParams

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (dteCode !== undefined) {
    filters.dteCode = dteCode
  }

  if (idCountry !== undefined) {
    filters.idCountry = idCountry
  }

  if (idDepartment !== undefined) {
    filters.idDepartment = idDepartment
  }

  if (zipCode !== undefined) {
    filters.zipCode = Like(`%${zipCode}%`)
  }

  if (status !== undefined) {
    filters.status = status
  }

  return filters
}

const existValuesValidations = async (name?: string, dteCode?: string, idCountry?: number, idDepartment?: number, idMunicipality?: number): Promise<void> => {
  if (name === undefined && dteCode === undefined && idCountry === undefined && idDepartment === undefined) return

  const filters: iMunicipalityQueryParams[] = [{ name }, { dteCode }]

  const [existMunicipality, existCountry, existDepartment] = await Promise.all([
    MunicipalityModel.findOne({
      select: ['idMunicipality', 'name', 'dteCode'],
      where: filters
    }),
    idCountry !== undefined
      ? CountryModel.findOne({ select: ['idCountry'], where: { idCountry } })
      : null,
    idDepartment !== undefined
      ? DepartmentModel.findOne({ select: ['idDepartment'], where: { idDepartment } })
      : null
  ])

  if (idCountry !== undefined && existCountry === null) {
    throw new IDMuniCountryNotFoundError()
  }

  if (idDepartment !== undefined && existDepartment === null) {
    throw new IDMuniDepartmentNotFoundError()
  }

  if (existMunicipality !== null) {
    // Searching for name matches
    if (existMunicipality.name === name && existMunicipality.idMunicipality !== idMunicipality) {
      throw new NameExistsError()
    }

    // Searching for code matches
    // commented because in municipalities this code can be repeated
    // if (existMunicipality.dteCode === dteCode && existMunicipality.idMunicipality !== idMunicipality) {
    //   throw new MunicipalityCodeExistsError()
    // }
  }
}

const existIdValidation = async (idMunicipality: number): Promise<void> => {
  // Existing municipality per ID
  const existMunicipality = await MunicipalityModel.findOne({
    select: ['idMunicipality'], where: { idMunicipality }
  })

  if (existMunicipality === null) throw new IDMunicipalityNotFoundError()
}
