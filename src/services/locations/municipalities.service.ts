import { logger, applyFilter } from "../../helpers"
import { MunicipalityModel } from "../../models"
import {
  IFilterSettings,
  IGetMunicipalityByIdResponse,
  IGetMunicipalitiesResponse,
  IMunicipalityQueryParams,
  IMunicipalityFilters,
  IMunicipality,
} from "../../interfaces"
import {
  IDMunicipalityNotFoundError,
  // MunicipalityCodeExistsError,
  IDMuniCountryNotFoundError,
  IDMuniDepartmentNotFoundError,
  NameExistsError,
} from "../../errors/locations/municipality.factory"

import { countryGetById, departmentGetById } from "."

export const municipalityCreate = async (
  municipality: IMunicipality,
): Promise<IMunicipality> => {
  try {
    // Searching for name matches
    await existValuesValidations(
      municipality.name,
      municipality.dteCode,
      municipality.idCountry,
      municipality.idDepartment,
    )

    // Create municipality
    const createdMunicipality = await MunicipalityModel.save({ ...municipality })
    return createdMunicipality
  } catch (error) {
    logger.error("Create municipality: " + (error as Error).name)
    throw error
  }
}

export const municipalityUpdate = async (
  municipality: IMunicipality,
  idMunicipality: number,
): Promise<IMunicipality> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idMunicipality),
      existValuesValidations(
        municipality.name,
        municipality.dteCode,
        municipality.idCountry,
        municipality.idDepartment,
        idMunicipality,
      ),
    ])

    // update municipality
    const updatedMunicipality = await MunicipalityModel.save({
      idMunicipality,
      ...municipality,
    })
    return updatedMunicipality
  } catch (error) {
    logger.error("Update municipality: " + (error as Error).name)
    throw error
  }
}

export const municipalityUpdateStatus = async (
  idMunicipality: number,
  status: boolean,
): Promise<IMunicipality> => {
  try {
    // Existing municipality
    await existIdValidation(idMunicipality)

    // update municipality status
    const updatedMunicipality = await MunicipalityModel.save({
      idMunicipality,
      status,
    })
    return updatedMunicipality
  } catch (error) {
    logger.error("Update municipality status: " + (error as Error).name)
    throw error
  }
}

export const municipalityGetAll = async (
  filterParams: IMunicipalityFilters,
  settings: IFilterSettings,
): Promise<IGetMunicipalitiesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [municipalities, totalCount] = await Promise.all([
      MunicipalityModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order,
      }),
      MunicipalityModel.count({ where: filters }),
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: municipalities,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages,
    }
  } catch (error) {
    logger.error("Get municipalities: " + (error as Error).name)
    throw error
  }
}

export const municipalityGetById = async (
  idMunicipality: number,
): Promise<IGetMunicipalityByIdResponse> => {
  try {
    const municipality = await MunicipalityModel.findOne({
      where: { idMunicipality },
    })
    return { data: municipality }
  } catch (error) {
    logger.error("Get municipality by id: " + (error as Error).name)
    throw error
  }
}

const getFilters = (params: IMunicipalityFilters): IMunicipalityQueryParams => {
  const filters: IMunicipalityQueryParams = {}

  applyFilter(filters, "name", params.name, true)
  applyFilter(filters, "zipCode", params.zipCode, true)
  applyFilter(filters, "dteCode", params.dteCode)
  applyFilter(filters, "idCountry", params.idCountry)
  applyFilter(filters, "idDepartment", params.idDepartment)
  applyFilter(filters, "status", params.status)

  return filters
}

const existValuesValidations = async (
  name?: string,
  dteCode?: string,
  idCountry?: number,
  idDepartment?: number,
  idMunicipality?: number,
): Promise<void> => {
  const params = [name, dteCode, idCountry, idDepartment]
  if (!params.some((p) => p !== undefined)) return

  const filters: IMunicipalityQueryParams[] = [{ name }, { dteCode }]

  const [existMunicipality, existCountry, existDepartment] = await Promise.all([
    MunicipalityModel.findOne({
      select: ["idMunicipality", "name", "dteCode"],
      where: filters,
    }),
    idCountry !== undefined ? countryGetById(idCountry) : null,
    idDepartment !== undefined ? departmentGetById(idDepartment) : null,
  ])

  if (idCountry !== undefined && existCountry?.data === null) {
    throw new IDMuniCountryNotFoundError()
  }

  if (idDepartment !== undefined && existDepartment?.data === null) {
    throw new IDMuniDepartmentNotFoundError()
  }

  if (existMunicipality !== null) {
    // Searching for name matches
    if (
      existMunicipality.name === name &&
      existMunicipality.idMunicipality !== idMunicipality
    ) {
      throw new NameExistsError()
    }
  }
}

const existIdValidation = async (idMunicipality: number): Promise<void> => {
  // Existing municipality per ID
  const existMunicipality = await municipalityGetById(idMunicipality)

  if (existMunicipality.data === null) throw new IDMunicipalityNotFoundError()
}
