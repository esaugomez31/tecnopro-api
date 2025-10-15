import { Request, Response } from "express"
import { matchedData } from "express-validator"

import * as categoryService from "../services/categories.service"
import { filtersettings } from "../helpers"
import { NameExistsError, IDCategoryNotFoundError } from "../errors/category.error"
import {
  ICategoryGetCustomRequest,
  ICategoryCommonRequest,
  ICategoryFilters,
  ICategory,
} from "../interfaces"

export const categoryCreateController = async (
  req: ICategoryCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = matchedData<ICategory>(req, {
      locations: ["body"],
      includeOptionals: true,
    })
    // Service create category
    const category = await categoryService.categoryCreate(body)

    res.json(category)
  } catch (error) {
    if (error instanceof NameExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const categoryUpdateController = async (
  req: ICategoryCommonRequest,
  res: Response,
): Promise<void> => {
  try {
    const idCategory = Number(req.params.idCategory)
    const body = matchedData<ICategory>(req, {
      locations: ["body"],
      includeOptionals: true,
    })
    // Service update category
    const category = await categoryService.categoryUpdate(body, idCategory)

    res.json(category)
  } catch (error) {
    if (error instanceof IDCategoryNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof NameExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const categoryUpdateStatusController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const idCategory = Number(req.params.idCategory)
    const status = Boolean(req.params.status)
    // update status service
    const category = await categoryService.categoryUpdateStatus(idCategory, status)

    res.json(category)
  } catch (error) {
    if (error instanceof IDCategoryNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const categoryGetAllController = async (
  req: ICategoryGetCustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params category
    const params: ICategoryFilters = {
      name: query.name,
      status: query.status,
      description: query.description,
      uuid: query.uuid,
    }

    const categories = await categoryService.categoryGetAll(params, settings)
    res.json(categories)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}

export const categoryGetByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Get category id param
    const idCategory: number = Number(req.params.idCategory)

    const category = await categoryService.categoryGetById(idCategory)

    res.json(category)
  } catch (_error) {
    // Default error message
    res.status(500).json({ error: "Internal server error" })
  }
}
