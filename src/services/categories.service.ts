import { v4 as uuidv4 } from "uuid"

import { CategoryModel } from "../models"
import { logger, applyFilter } from "../helpers"
import {
  IFilterSettings,
  IGetCategoryByIdResponse,
  IGetCategoriesResponse,
  ICategoryQueryParams,
  ICategoryFilters,
  ICategory,
} from "../interfaces"
import { IDCategoryNotFoundError, NameExistsError } from "../errors/category.error"

export const categoryCreate = async (category: ICategory): Promise<ICategory> => {
  try {
    // Searching for name matches
    await existNameValidations(category.name)

    // assign UUID
    category.uuid = uuidv4()

    // Create category
    const createdCategory = await CategoryModel.save({ ...category })
    return createdCategory
  } catch (error) {
    logger.error("Create category: " + (error as Error).name)
    throw error
  }
}

export const categoryUpdate = async (
  category: ICategory,
  idCategory: number,
): Promise<ICategory> => {
  try {
    // Required validations to update
    await Promise.all([
      existIdValidation(idCategory),
      existNameValidations(category.name, idCategory),
    ])

    // update category
    const updatedCategory = await CategoryModel.save({
      idCategory,
      ...category,
    })
    return updatedCategory
  } catch (error) {
    logger.error("Update category: " + (error as Error).name)
    throw error
  }
}

export const categoryUpdateStatus = async (
  idCategory: number,
  status: boolean,
): Promise<ICategory> => {
  try {
    // Existing category
    await existIdValidation(idCategory)

    // update category status
    const updatedCategory = await CategoryModel.save({
      idCategory,
      status,
    })
    return updatedCategory
  } catch (error) {
    logger.error("Update category status: " + (error as Error).name)
    throw error
  }
}

export const categoryGetAll = async (
  filterParams: ICategoryFilters,
  settings: IFilterSettings,
): Promise<IGetCategoriesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [categories, totalCount] = await Promise.all([
      CategoryModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order,
      }),
      CategoryModel.count({ where: filters }),
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: categories,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages,
    }
  } catch (error) {
    logger.error("Get categories: " + (error as Error).name)
    throw error
  }
}

export const categoryGetById = async (
  idCategory: number,
): Promise<IGetCategoryByIdResponse> => {
  try {
    const category = await CategoryModel.findOne({
      where: { idCategory },
    })
    return { data: category }
  } catch (error) {
    logger.error("Get category by id: " + (error as Error).name)
    throw error
  }
}

const getFilters = (params: ICategoryFilters): ICategoryQueryParams => {
  const filters: ICategoryQueryParams = {}

  applyFilter(filters, "name", params.name, true)
  applyFilter(filters, "description", params.description, true)
  applyFilter(filters, "uuid", params.uuid)
  applyFilter(filters, "status", params.status)

  return filters
}

const existNameValidations = async (
  name?: string,
  idCategory?: number,
): Promise<void> => {
  if (name === undefined) return

  const filters: ICategoryQueryParams[] = [{ name }]

  const existCategory = await CategoryModel.findOne({
    select: ["idCategory", "name"],
    where: filters,
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
  const existCategory = await categoryGetById(idCategory)

  if (existCategory.data === null) throw new IDCategoryNotFoundError()
}
