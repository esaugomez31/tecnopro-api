import { Like } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { CategoryModel } from '../models'
import { logger } from '../helpers'
import {
  iFilterSettings,
  iGetCategoryByIdResponse,
  iGetCategoriesResponse,
  iCategoryQueryParams,
  iCategoryFilters
} from '../interfaces'
import {
  IDCategoryNotFoundError,
  NameExistsError
} from '../errors/category.error'

export const categoryCreate = async (category: CategoryModel): Promise<CategoryModel> => {
  try {
    // Searching for name matches
    await existNameValidations(category.name)

    // assign UUID
    category.uuid = uuidv4()

    // Create category
    const createdCategory = await CategoryModel.save(category)
    return createdCategory
  } catch (error) {
    logger.error('Create category: ' + (error as Error).name)
    throw error
  }
}

export const categoryUpdate = async (category: CategoryModel, idCategory: number): Promise<CategoryModel> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idCategory),
      existNameValidations(category.name, idCategory)
    ])

    // update category
    const updatedCategory = await CategoryModel.save({
      idCategory, ...category
    })
    return updatedCategory
  } catch (error) {
    logger.error('Update category: ' + (error as Error).name)
    throw error
  }
}

export const categoryUpdateStatus = async (idCategory: number, status: boolean): Promise<CategoryModel> => {
  try {
    // Existing category
    await existIdValidation(idCategory)

    // update category status
    const updatedCategory = await CategoryModel.save({
      idCategory, status
    })
    return updatedCategory
  } catch (error) {
    logger.error('Update category status: ' + (error as Error).name)
    throw error
  }
}

export const categoryGetAll = async (filterParams: iCategoryFilters, settings: iFilterSettings): Promise<iGetCategoriesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [categories, totalCount] = await Promise.all([
      CategoryModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      CategoryModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: categories,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get categories: ' + (error as Error).name)
    throw error
  }
}

export const categoryGetById = async (idCategory: number): Promise<iGetCategoryByIdResponse> => {
  try {
    const category = await CategoryModel.findOne({
      where: { idCategory }
    })
    return { data: category ?? {} }
  } catch (error) {
    logger.error('Get category by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iCategoryFilters): iCategoryQueryParams => {
  const filters: iCategoryQueryParams = {}
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

const existNameValidations = async (name?: string, idCategory?: number): Promise<void> => {
  if (name === undefined) return

  const filters: iCategoryQueryParams[] = [{ name }]

  const existCategory = await CategoryModel.findOne({
    select: ['idCategory', 'name'],
    where: filters
  })

  if (existCategory !== null) {
    // Searching for name matches
    if (existCategory.name === name && existCategory.idCategory !== idCategory) {
      throw new NameExistsError()
    }
  }
}

const existIdValidation = async (idCategory: number): Promise<void> => {
  // Existing category per ID
  const existCategory = await CategoryModel.findOne({
    select: ['idCategory'], where: { idCategory }
  })

  if (existCategory === null) throw new IDCategoryNotFoundError()
}
