import { CountryModel } from "../../models"
import { logger, applyFilter } from "../../helpers"
import {
  IFilterSettings,
  IGetCountryByIdResponse,
  IGetCountriesResponse,
  ICountryQueryParams,
  ICountryFilters,
  ICountry,
} from "../../interfaces"
import {
  IDCountryNotFoundError,
  CountryCodeExistsError,
  NameExistsError,
} from "../../errors/locations/country.factory"

export const countryCreate = async (country: ICountry): Promise<ICountry> => {
  try {
    // Searching for name matches
    await existValuesValidations(country.name, country.code)

    // Create country
    const createdCountry = await CountryModel.save({ ...country })
    return createdCountry
  } catch (error) {
    logger.error("Create country: " + (error as Error).name)
    throw error
  }
}

export const countryUpdate = async (
  country: ICountry,
  idCountry: number,
): Promise<ICountry> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idCountry),
      existValuesValidations(country.name, country.code, idCountry),
    ])

    // update country
    const updatedCountry = await CountryModel.save({
      idCountry,
      ...country,
    })
    return updatedCountry
  } catch (error) {
    logger.error("Update country: " + (error as Error).name)
    throw error
  }
}

export const countryUpdateStatus = async (
  idCountry: number,
  status: boolean,
): Promise<ICountry> => {
  try {
    // Existing country
    await existIdValidation(idCountry)

    // update country status
    const updatedCountry = await CountryModel.save({
      idCountry,
      status,
    })
    return updatedCountry
  } catch (error) {
    logger.error("Update country status: " + (error as Error).name)
    throw error
  }
}

export const countryGetAll = async (
  filterParams: ICountryFilters,
  settings: IFilterSettings,
): Promise<IGetCountriesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const relations = getCountryIncludeFields(settings.include)

    const [countries, totalCount] = await Promise.all([
      CountryModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order,
        relations,
      }),
      CountryModel.count({ where: filters, relations }),
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: countries,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages,
    }
  } catch (error) {
    logger.error("Get countries: " + (error as Error).name)
    throw error
  }
}

export const countryGetById = async (
  idCountry: number,
  settings?: IFilterSettings,
): Promise<IGetCountryByIdResponse> => {
  try {
    const relations =
      settings !== undefined ? getCountryIncludeFields(settings.include) : []
    const country = await CountryModel.findOne({
      where: { idCountry },
      relations,
    })
    return { data: country }
  } catch (error) {
    logger.error("Get country by id: " + (error as Error).name)
    throw error
  }
}

const getCountryIncludeFields = (includes?: string[]): string[] => {
  const relations = []
  if (includes !== undefined) {
    if (includes.includes("departments")) {
      relations.push("departments")
    }
    if (includes.includes("municipalities")) {
      relations.push("departments.municipalities")
    }
  }
  return relations
}

const getFilters = (params: ICountryFilters): ICountryQueryParams => {
  const filters: ICountryQueryParams = {}

  applyFilter(filters, "name", params.name, true)
  applyFilter(filters, "code", params.code, true)
  applyFilter(filters, "zipCode", params.zipCode, true)
  applyFilter(filters, "status", params.status)

  return filters
}

const existValuesValidations = async (
  name?: string,
  code?: string | null,
  idCountry?: number,
): Promise<void> => {
  if (name == null && code == null) return

  const filters: ICountryQueryParams[] = []

  if (name != null) {
    filters.push({ name })
  }

  if (code != null) {
    filters.push({ code })
  }

  const existCountry = await CountryModel.findOne({
    select: ["idCountry", "name", "code"],
    where: filters,
  })

  if (existCountry !== null) {
    // Searching for name matches
    if (existCountry.name === name && existCountry.idCountry !== idCountry) {
      throw new NameExistsError()
    }
    // Searching for code matches
    if (existCountry.code === code && existCountry.idCountry !== idCountry) {
      throw new CountryCodeExistsError()
    }
  }
}

const existIdValidation = async (idCountry: number): Promise<void> => {
  // Existing country per ID
  const existCountry = await CountryModel.findOne({
    select: ["idCountry"],
    where: { idCountry },
  })

  if (existCountry === null) throw new IDCountryNotFoundError()
}
