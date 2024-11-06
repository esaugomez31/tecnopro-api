import { matchedData } from 'express-validator'
import { Request, Response } from 'express'
import * as productService from '../services/products.service'
import { ProductModel, PermissionModel } from '../models'
import { filtersettings } from '../helpers'
import {
  ProdUpdatePriceError,
  ProdUpdatePurchaseDataError,
  ProdUpdateCommissionsError,
  ProdUpdateStockError,
  IDProductNotFoundError,
  IDProdBranchNotFoundError,
  IDProdCategoryNotFoundError,
  IDProdBrandNotFoundError,
  IDProdUserNotFoundError
} from '../errors/product.error'
import {
  iProductGetCustomRequest,
  iProductCommonRequest,
  iProductFilters
} from '../interfaces'

export const productCreateController = async (req: iProductCommonRequest, res: Response): Promise<void> => {
  try {
    const body = matchedData<ProductModel>(req, {
      locations: ['body']
    })

    // Model product object
    const payload = new ProductModel()
    payload.status = true
    Object.assign(payload, body)

    const product = await productService.productCreate(payload)

    res.json(product)
  } catch (error) {
    if (
      error instanceof IDProdBranchNotFoundError ||
      error instanceof IDProdCategoryNotFoundError ||
      error instanceof IDProdBrandNotFoundError ||
      error instanceof IDProdUserNotFoundError
    ) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const productUpdateController = async (req: iProductCommonRequest, res: Response): Promise<void> => {
  try {
    const permissions: PermissionModel[] = req.permissions
    const idProduct = Number(req.params.idProduct)
    const body = matchedData<ProductModel>(req, {
      locations: ['body']
    })

    // Model product object
    const payload = new ProductModel()
    Object.assign(payload, body)

    const product = await productService.productUpdate(payload, idProduct, permissions)

    res.json(product)
  } catch (error) {
    if (
      error instanceof ProdUpdatePriceError ||
      error instanceof ProdUpdatePurchaseDataError ||
      error instanceof ProdUpdateCommissionsError ||
      error instanceof ProdUpdateStockError
    ) {
      res.status(403).json({ error: error.name, message: error.message })
      return
    }

    if (
      error instanceof IDProductNotFoundError ||
      error instanceof IDProdBranchNotFoundError ||
      error instanceof IDProdCategoryNotFoundError ||
      error instanceof IDProdBrandNotFoundError ||
      error instanceof IDProdUserNotFoundError
    ) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const productUpdateStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const idProduct = Number(req.params.idProduct)
    const status = Boolean(req.params.status)
    // update status service
    const product = await productService.productUpdateStatus(idProduct, status)

    res.json(product)
  } catch (error) {
    if (error instanceof IDProductNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const productGetAllController = async (req: iProductGetCustomRequest, res: Response): Promise<void> => {
  try {
    const query = req.query
    const permissions: PermissionModel[] = req.permissions
    // Filter params settings
    const settings = filtersettings(query)
    // Filter params product
    const params: iProductFilters = {
      name: query.name,
      status: query.status,
      description: query.description,
      uuid: query.uuid,
      location: query.location,
      code: query.code,
      idBranch: query.idBranch,
      idCategory: query.idCategory,
      idBrand: query.idBrand,
      idUser: query.idUser
    }

    const products = await productService.productGetAll(params, settings, permissions)
    res.json(products)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const productGetByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const permissions: PermissionModel[] = req.permissions
    // Get product id param
    const idProduct: number = Number(req.params.idProduct)

    const product = await productService.productGetById(idProduct, permissions)

    res.json(product)
  } catch (error) {
    // Default error message
    res.status(500).json({ error: 'Internal server error' })
  }
}
