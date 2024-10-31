import { Like } from 'typeorm'
import { CountryModel } from '../models'
import { logger } from '../helpers'
import {
  iFilterSettings,
  iGetCountryByIdResponse,
  iGetCountriesResponse,
  iCountryQueryParams,
  iCountryFilters
} from '../interfaces'
import {
  IDCountryNotFoundError,
  CountryCodeExistsError,
  NameExistsError
} from '../errors/country.factory'

export const countryCreate = async (country: CountryModel): Promise<CountryModel> => {
  try {
    // Searching for name matches
    await existValuesValidations(country.name, country.code)

    // Create country
    const createdCountry = await CountryModel.save(country)
    return createdCountry
  } catch (error) {
    logger.error('Create country: ' + (error as Error).name)
    throw error
  }
}

export const countryUpdate = async (country: CountryModel, idCountry: number): Promise<CountryModel> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idCountry),
      existValuesValidations(country.name, country.code, idCountry)
    ])

    // update country
    const updatedCountry = await CountryModel.save({
      idCountry, ...country
    })
    return updatedCountry
  } catch (error) {
    logger.error('Update country: ' + (error as Error).name)
    throw error
  }
}

export const countryUpdateStatus = async (idCountry: number, status: boolean): Promise<CountryModel> => {
  try {
    // Existing country
    await existIdValidation(idCountry)

    // update country status
    const updatedCountry = await CountryModel.save({
      idCountry, status
    })
    return updatedCountry
  } catch (error) {
    logger.error('Update country status: ' + (error as Error).name)
    throw error
  }
}

export const countryGetAll = async (filterParams: iCountryFilters, settings: iFilterSettings): Promise<iGetCountriesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [countries, totalCount] = await Promise.all([
      CountryModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      CountryModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: countries,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get countries: ' + (error as Error).name)
    throw error
  }
}

export const countryGetById = async (idCountry: number): Promise<iGetCountryByIdResponse> => {
  try {
    const country = await CountryModel.findOne({
      where: { idCountry }
    })
    return { data: country ?? {} }
  } catch (error) {
    logger.error('Get country by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iCountryFilters): iCountryQueryParams => {
  const filters: iCountryQueryParams = {}
  const { name, status, code, zipCode } = filterParams

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (code !== undefined) {
    filters.code = Like(`%${code}%`)
  }

  if (zipCode !== undefined) {
    filters.zipCode = Like(`%${zipCode}%`)
  }

  if (status !== undefined) {
    filters.status = status
  }

  return filters
}

const existValuesValidations = async (name?: string, code?: string, idCountry?: number): Promise<void> => {
  if (name === undefined && code === undefined) return

  const filters: iCountryQueryParams[] = [{ name }, { code }]

  const existCountry = await CountryModel.findOne({
    select: ['idCountry', 'name', 'code'],
    where: filters
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
    select: ['idCountry'], where: { idCountry }
  })

  if (existCountry === null) throw new IDCountryNotFoundError()
}
