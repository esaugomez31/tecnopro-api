import { Like } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { BrandModel } from '../models'
import { logger } from '../helpers'
import {
  iFilterSettings,
  iGetBrandByIdResponse,
  iGetBrandsResponse,
  iBrandQueryParams,
  iBrandFilters
} from '../interfaces'
import {
  IDBrandNotFoundError,
  NameExistsError
} from '../errors/brand.factory'

export const brandCreate = async (brand: BrandModel): Promise<BrandModel> => {
  try {
    // Searching for name matches
    await existNameValidations(brand.name)

    // assign UUID
    brand.uuid = uuidv4()

    // Create brand
    const createdBrand = await BrandModel.save(brand)
    return createdBrand
  } catch (error) {
    logger.error('Create brand: ' + (error as Error).name)
    throw error
  }
}

export const brandUpdate = async (brand: BrandModel, idBrand: number): Promise<BrandModel> => {
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

export const brandUpdateStatus = async (idBrand: number, status: boolean): Promise<BrandModel> => {
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

export const brandGetAll = async (filterParams: iBrandFilters, settings: iFilterSettings): Promise<iGetBrandsResponse> => {
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

export const brandGetById = async (idBrand: number): Promise<iGetBrandByIdResponse> => {
  try {
    const brand = await BrandModel.findOne({
      where: { idBrand }
    })
    return { data: brand ?? {} }
  } catch (error) {
    logger.error('Get brand by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iBrandFilters): iBrandQueryParams => {
  const filters: iBrandQueryParams = {}
  const { name, status, description, uuid } = filterParams

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (description !== undefined) {
    filters.description = Like(`%${description}%`)
  }

  if (uuid !== undefined) {
    filters.uuid = uuid
  }

  if (status !== undefined) {
    filters.status = status
  }

  return filters
}

const existNameValidations = async (name: string | undefined, idBrand: number | undefined = undefined): Promise<void> => {
  if (name === undefined) return

  const filters: iBrandQueryParams[] = [{ name }]

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
  const existBrand = await BrandModel.findOne({
    select: ['idBrand'], where: { idBrand }
  })

  if (existBrand === null) throw new IDBrandNotFoundError()
}
