import { v4 as uuidv4 } from 'uuid'
import {
  logger,
  hasPermission,
  isValidValue,
  applyFilter
} from '../helpers'
import {
  ProductModel,
  BranchModel,
  CategoryModel,
  BrandModel,
  UserModel,
  PermissionModel
} from '../models'
import {
  iFilterSettings,
  iGetProductByIdResponse,
  iGetProductsResponse,
  iProductQueryParams,
  iProductFilters,
  ProductPermEnum
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

export const productUpdate = async (product: ProductModel, idProduct: number, permissions?: PermissionModel[]): Promise<ProductModel | {}> => {
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

export const productGetAll = async (filterParams: iProductFilters, settings: iFilterSettings, permissions?: PermissionModel[]): Promise<iGetProductsResponse> => {
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

export const productGetById = async (idProduct: number, permissions?: PermissionModel[]): Promise<iGetProductByIdResponse> => {
  try {
    const product = await ProductModel.findOne({
      where: { idProduct }
    })
    return { data: product !== null ? getProductAvailableInfo(product, permissions) : {} }
  } catch (error) {
    logger.error('Get product by id: ' + (error as Error).name)
    throw error
  }
}

const getProductAvailableInfo = (product: ProductModel, permissions?: PermissionModel[]): ProductModel => {
  if (permissions !== undefined) {
    if (!hasPermission(permissions, ProductPermEnum.SEEPURCHASEDATA)) {
      delete product.purchasePrice
      delete product.purchasedBy
    }
  }

  return product
}

const evaluateUpdatePermission = (product: ProductModel, permissions?: PermissionModel[]): void => {
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

const getFilters = (params: iProductFilters): iProductQueryParams => {
  const filters: iProductQueryParams = {}

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
