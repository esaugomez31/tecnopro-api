import { Like } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '../helpers'
import {
  ProductModel,
  BranchModel,
  CategoryModel,
  BrandModel,
  UserModel
} from '../models'
import {
  iFilterSettings,
  iGetProductByIdResponse,
  iGetProductsResponse,
  iProductQueryParams,
  iProductFilters
} from '../interfaces'
import {
  IDProductNotFoundError,
  IDProdBranchNotFoundError,
  IDProdCategoryNotFoundError,
  IDProdBrandNotFoundError,
  IDProdUserNotFoundError
} from '../errors/product.factory'

export const productCreate = async (product: ProductModel): Promise<ProductModel | {}> => {
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
    const createdProduct = await ProductModel.save(product)

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

export const productUpdate = async (product: ProductModel, idProduct: number): Promise<ProductModel | {}> => {
  try {
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

    return getProduct !== null ? getProduct : {}
  } catch (error) {
    logger.error('Update product: ' + (error as Error).name)
    throw error
  }
}

export const productUpdateStatus = async (idProduct: number, status: boolean): Promise<ProductModel> => {
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

export const productGetAll = async (filterParams: iProductFilters, settings: iFilterSettings): Promise<iGetProductsResponse> => {
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

    return {
      data: products,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get products: ' + (error as Error).name)
    throw error
  }
}

export const productGetById = async (idProduct: number): Promise<iGetProductByIdResponse> => {
  try {
    const product = await ProductModel.findOne({
      where: { idProduct }
    })
    return { data: product ?? {} }
  } catch (error) {
    logger.error('Get product by id: ' + (error as Error).name)
    throw error
  }
}

const getFilters = (filterParams: iProductFilters): iProductQueryParams => {
  const filters: iProductQueryParams = {}
  const {
    name,
    status,
    description,
    uuid,
    location,
    code,
    barcode,
    idBranch,
    idBrand,
    idCategory,
    idUser
  } = filterParams

  if (name !== undefined) {
    filters.name = Like(`%${name}%`)
  }

  if (description !== undefined) {
    filters.description = Like(`%${description}%`)
  }

  if (uuid !== undefined) {
    filters.uuid = uuid
  }

  if (location !== undefined) {
    filters.location = Like(`%${location}%`)
  }

  if (code !== undefined) {
    filters.code = Like(`%${code}%`)
  }

  if (barcode !== undefined) {
    filters.barcode = barcode
  }

  if (idBranch !== undefined) {
    filters.idBranch = idBranch
  }

  if (idBrand !== undefined) {
    filters.idBrand = idBrand
  }

  if (idCategory !== undefined) {
    filters.idCategory = idCategory
  }

  if (idUser !== undefined) {
    filters.idUser = idUser
  }

  if (status !== undefined) {
    filters.status = status
  }

  return filters
}

const existIdValidation = async (idProduct: number): Promise<void> => {
  // Existing product per ID
  const existProduct = await ProductModel.findOne({
    select: ['idProduct'], where: { idProduct }
  })

  if (existProduct === null) throw new IDProductNotFoundError()
}

const existValuesValidations = async (
  idBranch?: number,
  idCategory?: number,
  idBrand?: number,
  idUser?: number): Promise<void> => {
  if (
    idBranch === undefined &&
    idCategory === undefined &&
    idBrand === undefined &&
    idUser === undefined
  ) return

  const [existBranch, existCategory, existBrand, existUser] = await Promise.all([
    idBranch !== undefined
      ? BranchModel.findOne({ select: ['idBranch'], where: { idBranch } })
      : null,
    idCategory !== undefined
      ? CategoryModel.findOne({ select: ['idCategory'], where: { idCategory } })
      : null,
    idBrand !== undefined
      ? BrandModel.findOne({ select: ['idBrand'], where: { idBrand } })
      : null,
    idUser !== undefined
      ? UserModel.findOne({ select: ['idUser'], where: { idUser } })
      : null
  ])

  if (idBranch !== undefined && existBranch === null) {
    throw new IDProdBranchNotFoundError()
  }

  if (idCategory !== undefined && existCategory === null) {
    throw new IDProdCategoryNotFoundError()
  }

  if (idBrand !== undefined && existBrand === null) {
    throw new IDProdBrandNotFoundError()
  }

  if (idUser !== undefined && existUser === null) {
    throw new IDProdUserNotFoundError()
  }
}
