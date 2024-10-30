import { Request, Response } from 'express'
import * as categoryService from '../services/categories.service'
import { CategoryModel } from '../models'
import { filtersettings } from '../helpers'
import {
  NameExistsError,
  IDCategoryNotFoundError
} from '../errors/category.factory'
import {
  iCategoryGetCustomRequest,
  iCategoryCommonRequest,
  iCategoryFilters
} from '../interfaces'

export const categoryCreateController = async (req: iCategoryCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body

    // Model category object
    const payload = new CategoryModel()
    payload.name = body.name
    payload.description = body.description
    payload.status = true

    const category = await categoryService.categoryCreate(payload)

    res.json(category)
  } catch (error) {
    if (error instanceof NameExistsError) {
      res.status(409).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const categoryUpdateController = async (req: iCategoryCommonRequest, res: Response): Promise<void> => {
  try {
    const body = req.body
    const idCategory = Number(req.params.idCategory)

    // Model category object
    const payload = new CategoryModel()
    payload.name = body.name
    payload.description = body.description

    const category = await categoryService.categoryUpdate(payload, idCategory)

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
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const categoryUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
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
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const categoryGetAllController = async (req: iCategoryGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params category
    const params: iCategoryFilters = {
      name: query.name,
      status: query.status,
      description: query.description,
      uuid: query.uuid
    }

    const categories = await categoryService.categoryGetAll(params, settings)
    res.json(categories)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const categoryGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get category id param
    const idCategory: number = Number(req.params.idCategory)

    const category = await categoryService.categoryGetById(idCategory)

    res.json(category)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
