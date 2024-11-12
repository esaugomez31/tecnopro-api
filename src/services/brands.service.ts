import { v4 as uuidv4 } from 'uuid'
import { BrandModel } from '../models'
import { logger, applyFilter } from '../helpers'
import {
  IFilterSettings,
  IGetBrandByIdResponse,
  IGetBrandsResponse,
  IBrandQueryParams,
  IBrandFilters,
  IBrand
} from '../interfaces'
import {
  IDBrandNotFoundError,
  NameExistsError
} from '../errors/brand.error'

export const brandCreate = async (brand: IBrand): Promise<IBrand> => {
  try {
    // Searching for name matches
    await existNameValidations(brand.name)

    // assign UUID
    brand.uuid = uuidv4()

    // Create brand
    const createdBrand = await BrandModel.save({ ...brand })
    return createdBrand
  } catch (error) {
    logger.error('Create brand: ' + (error as Error).name)
    throw error
  }
}

export const brandUpdate = async (brand: IBrand, idBrand: number): Promise<IBrand> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idBrand),
      existNameValidations(brand.name, idBrand)
    ])

    // update brand
    const updatedBrand = await BrandModel.save({
      idBrand, ...brand
    })
    return updatedBrand
  } catch (error) {
    logger.error('Update brand: ' + (error as Error).name)
    throw error
  }
}

export const brandUpdateStatus = async (idBrand: number, status: boolean): Promise<IBrand> => {
  try {
    // Existing brand
    await existIdValidation(idBrand)

    // update brand status
    const updatedBrand = await BrandModel.save({
      idBrand, status
    })
    return updatedBrand
  } catch (error) {
    logger.error('Update brand status: ' + (error as Error).name)
    throw error
  }
}

export const brandGetAll = async (filterParams: IBrandFilters, settings: IFilterSettings): Promise<IGetBrandsResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [brands, totalCount] = await Promise.all([
      BrandModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      BrandModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: brands,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get brands: ' + (error as Error).name)
    throw error
  }
}

export const brandGetById = async (idBrand: number): Promise<IGetBrandByIdResponse> => {
  try {
    const brand = await BrandModel.findOne({
      where: { idBrand }
    })
    return { data: brand }
  } catch (error) {
    logger.error('Get brand by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (params: IBrandFilters): IBrandQueryParams => {
  const filters: IBrandQueryParams = {}

  applyFilter(filters, 'name', params.name, true)
  applyFilter(filters, 'description', params.description, true)
  applyFilter(filters, 'uuid', params.uuid)
  applyFilter(filters, 'status', params.status)

  return filters
}

const existNameValidations = async (name?: string, idBrand?: number): Promise<void> => {
  if (name === undefined) return

  const filters: IBrandQueryParams[] = [{ name }]

  const existBrand = await BrandModel.findOne({
    select: ['idBrand', 'name'],
    where: filters
  })

  if (existBrand !== null) {
    // Searching for name matches
    if (existBrand.name === name && existBrand.idBrand !== idBrand) {
      throw new NameExistsError()
    }
  }
}

const existIdValidation = async (idBrand: number): Promise<void> => {
  // Existing brand per ID
  const existBrand = await brandGetById(idBrand)

  if (existBrand.data === null) throw new IDBrandNotFoundError()
}
