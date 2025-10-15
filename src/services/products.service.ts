import { v4 as uuidv4 } from 'uuid'
import { In } from 'typeorm'

import {
  branchGetById,
  brandGetById,
  categoryGetById,
  userGetById
} from '.'
import {
  logger,
  hasPermission,
  isValidValue,
  applyFilter
} from '../helpers'
import {
  ProductModel
} from '../models'
import {
  IFilterSettings,
  IGetProductByIdResponse,
  IGetProductsResponse,
  IProductQueryParams,
  IProductFilters,
  ProductPermEnum,
  IProduct,
  IPermission
} from '../interfaces'
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

export const productCreate = async (product: IProduct): Promise<IProduct | {}> => {
  try {
    // validation id's
    await existValuesValidations(
      product.idBranch,
      product.idCategory,
      product.idBrand,
      product.idUser
    )
    // assign UUID
    product.uuid = uuidv4()

    // Create product
    const createdProduct = await ProductModel.save({ ...product })

    // return db response
    const getProduct = await ProductModel.findOne({
      where: { idBranch: createdProduct.idProduct }
    })

    return getProduct !== null ? getProduct : {}
  } catch (error) {
    logger.error('Create product: ' + (error as Error).name)
    throw error
  }
}

export const productUpdate = async (product: IProduct, idProduct: number, permissions?: IPermission[]): Promise<IProduct | {}> => {
  try {
    // Evaluate update Price's Permission
    evaluateUpdatePermission(product, permissions)

    // Required validations to update
    await Promise.all([
      existIdValidation(idProduct),
      existValuesValidations(
        product.idBranch,
        product.idCategory,
        product.idBrand,
        product.idUser
      )
    ])

    // update product
    const updatedProduct = await ProductModel.save({
      idProduct, ...product
    })

    // return db response
    const getProduct = await ProductModel.findOne({
      where: { idBranch: updatedProduct.idProduct }
    })

    return getProduct !== null ? getProductAvailableInfo(getProduct, permissions) : {}
  } catch (error) {
    logger.error('Update product: ' + (error as Error).name)
    throw error
  }
}

export const productUpdateStatus = async (idProduct: number, status: boolean): Promise<IProduct> => {
  try {
    // Existing product
    await existIdValidation(idProduct)

    // update product status
    const updatedProduct = await ProductModel.save({
      idProduct, status
    })
    return updatedProduct
  } catch (error) {
    logger.error('Update product status: ' + (error as Error).name)
    throw error
  }
}

export const productGetAll = async (filterParams: IProductFilters, settings: IFilterSettings, permissions?: IPermission[]): Promise<IGetProductsResponse> => {
  try {
    const filters = getFilters(filterParams)
    const [products, totalCount] = await Promise.all([
      ProductModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order
      }),
      ProductModel.count({ where: filters })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)
    const response = products.map(product => getProductAvailableInfo(product, permissions))

    return {
      data: response,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get products: ' + (error as Error).name)
    throw error
  }
}

export const productGetById = async (idProduct: number, permissions?: IPermission[]): Promise<IGetProductByIdResponse> => {
  try {
    const product = await ProductModel.findOne({
      where: { idProduct }
    })
    return { data: product !== null ? getProductAvailableInfo(product, permissions) : null }
  } catch (error) {
    logger.error('Get product by id: ' + (error as Error).name)
    throw error
  }
}

export const productsGetByIds = async (ids: number[]): Promise<IProduct[]> => {
  try {
    const product = await ProductModel.find({
      where: { idProduct: In(ids), status: true }
    })
    return product
  } catch (error) {
    logger.error('Get products by ids: ' + (error as Error).name)
    throw error
  }
}

const getProductAvailableInfo = (product: IProduct, permissions?: IPermission[]): IProduct => {
  if (permissions !== undefined) {
    if (!hasPermission(permissions, ProductPermEnum.SEEPURCHASEDATA)) {
      delete product.purchasePrice
      delete product.purchasedBy
    }
  }

  return product
}

const evaluateUpdatePermission = (product: IProduct, permissions?: IPermission[]): void => {
  if (permissions === undefined) return

  if (isValidValue(product.price)) {
    if (!hasPermission(permissions, ProductPermEnum.UPDTPRICE)) {
      throw new ProdUpdatePriceError()
    }
  }
  if (isValidValue(product.branchCommissionPercent) || isValidValue(product.userCommissionPercent)) {
    if (!hasPermission(permissions, ProductPermEnum.UPDTCOMMISSIONS)) {
      throw new ProdUpdateCommissionsError()
    }
  }
  if (isValidValue(product.purchasePrice) || isValidValue(product.purchasedBy)) {
    if (!hasPermission(permissions, ProductPermEnum.UPDTPURCHASEDATA)) {
      throw new ProdUpdatePurchaseDataError()
    }
  }
  if (isValidValue(product.stock)) {
    if (!hasPermission(permissions, ProductPermEnum.UPDTSTOCK)) {
      throw new ProdUpdateStockError()
    }
  }
}

const getFilters = (params: IProductFilters): IProductQueryParams => {
  const filters: IProductQueryParams = {}

  applyFilter(filters, 'name', params.name, true)
  applyFilter(filters, 'description', params.description, true)
  applyFilter(filters, 'location', params.location, true)
  applyFilter(filters, 'code', params.code, true)
  applyFilter(filters, 'uuid', params.uuid)
  applyFilter(filters, 'barcode', params.barcode)
  applyFilter(filters, 'idBranch', params.idBranch)
  applyFilter(filters, 'idBrand', params.idBrand)
  applyFilter(filters, 'idCategory', params.idCategory)
  applyFilter(filters, 'idUser', params.idUser)
  applyFilter(filters, 'status', params.status)

  return filters
}

const existIdValidation = async (idProduct: number): Promise<void> => {
  // Existing product per ID
  const existProduct = await productGetById(idProduct)

  if (existProduct.data === null) throw new IDProductNotFoundError()
}

const existValuesValidations = async (
  idBranch?: number,
  idCategory?: number,
  idBrand?: number,
  idUser?: number): Promise<void> => {
  const ids = [idBranch, idCategory, idBrand, idUser]
  if (!ids.some(id => id !== undefined)) return

  const [existBranch, existCategory, existBrand, existUser] = await Promise.all([
    idBranch !== undefined ? branchGetById(idBranch) : null,
    idCategory !== undefined ? categoryGetById(idCategory) : null,
    idBrand !== undefined ? brandGetById(idBrand) : null,
    idUser !== undefined ? userGetById(idUser) : null
  ])

  if (idBranch !== undefined && existBranch?.data === null) {
    throw new IDProdBranchNotFoundError()
  }

  if (idCategory !== undefined && existCategory?.data === null) {
    throw new IDProdCategoryNotFoundError()
  }

  if (idBrand !== undefined && existBrand?.data === null) {
    throw new IDProdBrandNotFoundError()
  }

  if (idUser !== undefined && existUser?.data === null) {
    throw new IDProdUserNotFoundError()
  }
}
