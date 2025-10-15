import { v4 as uuidv4 } from 'uuid'
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'

import {
  productsGetByIds,
  branchGetById,
  customerGetById
} from '.'
import { SaleModel, SaleDetailModel } from '../models'
import { logger, numberToWords, applyFilter } from '../helpers'
import {
  IBranchResponse,
  IFilterSettings,
  IGetSaleByIdResponse,
  IGetSalesResponse,
  ISaleQueryParams,
  ISaleFilters,
  ISaleRequest,
  ISaleProduct,
  ISaleTotals,
  ICustomer,
  ISale
} from '../interfaces'
import {
  IDSaleNotFoundError,
  CreateSaleMissingProductError,
  IDSaleCustomerNotFoundError,
  IDSaleBranchNotFoundError,
  GetSaleCreatedDetailError,
  SaleProductNotFoundError,
  CreateSaleDetailError,
  CreateSaleError
} from '../errors/sale.error'

export const saleGenerate = async (data: ISaleRequest, idUser: number): Promise<ISale | {}> => {
  try {
    // required validations
    const { branch } = await existValuesValidations(
      data.idBranch,
      data.idCustomer as number
    )

    // generate sale data
    const { totals, details } = await generateSaleData(
      data.products,
      data.shippingCost,
      branch.vatEnabled ?? false
    )
    const { products: _, ...mainData } = data

    // assign UUID
    const uuid = uuidv4()
    // Sales payload
    const salePayload: ISale = {
      ...mainData,
      ...totals,
      idUser,
      uuid
    }

    // Save sale
    const newSale = await saleCreate({ ...salePayload })

    // Save sale-detail
    const deaildwithId: SaleDetailModel[] = details.map(detail => {
      return Object.assign(detail, { idSale: newSale.idSale })
    })
    const saleDetail = await saleDetailCreate(deaildwithId)
    if (saleDetail.length !== details.length) {
      throw new CreateSaleMissingProductError()
    }

    // find new sale
    const sale = await getSaleCreated(newSale.idSale as number, uuid)

    return sale !== null ? sale : {}
  } catch (error) {
    logger.error('Generate sale: ' + (error as Error).name)
    throw error
  }
}

export const saleCreate = async (sale: ISale): Promise<ISale> => {
  try {
    const createdSale = await SaleModel.save({ ...sale })
    return createdSale
  } catch (error) {
    logger.error('Create sale: ' + (error as Error).name)
    throw new CreateSaleError()
  }
}

export const saleDetailCreate = async (detail: SaleDetailModel[]): Promise<SaleDetailModel[]> => {
  try {
    const createdDetail = await SaleDetailModel.save(detail)
    return createdDetail
  } catch (error) {
    logger.error('Create sale-detail: ' + (error as Error).name)
    throw new CreateSaleDetailError()
  }
}

export const getSaleCreated = async (idSale: number, uuid: string): Promise<ISale | null> => {
  try {
    const createdSale = await SaleModel.findOne({
      where: [{ idSale }, { uuid }],
      relations: ['customer', 'saleDetails']
    })
    return createdSale
  } catch (error) {
    logger.error('Get-sale-created: ' + (error as Error).name)
    throw new GetSaleCreatedDetailError()
  }
}

const generateSaleData = async (
  products: ISaleProduct[], shippingCost?: number, vatActived: boolean = false
): Promise<{ details: SaleDetailModel[], totals: ISaleTotals }> => {
  const totals = {
    total: typeof shippingCost === 'number' ? shippingCost : 0,
    subtotal: 0,
    vat: 0,
    totalProfit: 0,
    grossProfit: 0,
    usersCommission: 0
  }

  const details: SaleDetailModel[] = []

  // Load database products
  const productIds = products.map(product => product.idProduct)
  const dbproducts = await productsGetByIds(productIds)
  if (dbproducts.length < 1) throw new SaleProductNotFoundError()

  dbproducts.forEach(dbProd => {
    const productInv = products.filter(prod => prod.idProduct === dbProd.idProduct)
    if (productInv.length < 1) throw new SaleProductNotFoundError()

    productInv.forEach(prod => {
      // Calculating amounts
      const price = parseFloat((prod.price).toFixed(2))
      const quantity = parseFloat((prod.quantity).toFixed(4))
      const purchasePrice = dbProd.purchasePrice ?? 0
      const userCommissionP = dbProd.userCommissionPercent ?? 0

      const affectSale = parseFloat((price * quantity).toFixed(4))
      const currVat = vatActived ? parseFloat(((affectSale / 1.13) * 0.13).toFixed(4)) : 0
      const currProfit = parseFloat((affectSale - ((purchasePrice * quantity) + currVat)).toFixed(4))
      const currUserCommision = parseFloat((currProfit * (userCommissionP / 100)).toFixed(4))
      const currGrossProfit = parseFloat((currProfit - currUserCommision).toFixed(4))
      const currDiscount = parseFloat(((dbProd.price - price) * quantity).toFixed(4))

      // Totals update
      totals.total = parseFloat((totals.total + affectSale).toFixed(2))
      totals.subtotal = totals.total
      totals.vat = parseFloat((totals.vat + currVat).toFixed(2))
      totals.totalProfit = parseFloat((totals.totalProfit + currProfit).toFixed(2))
      totals.usersCommission = parseFloat((totals.usersCommission + currUserCommision).toFixed(2))
      totals.grossProfit = parseFloat((totals.grossProfit + currGrossProfit).toFixed(2))

      // Generate sale detail records
      const detail = new SaleDetailModel()
      detail.idProduct = dbProd.idProduct as number
      detail.purchasePrice = purchasePrice
      detail.price = price
      detail.quantity = quantity
      detail.affectedSale = affectSale
      detail.discount = currDiscount
      detail.vat = currVat
      detail.userCommission = currUserCommision
      detail.branchCommission = currGrossProfit

      details.push(detail)
    })
  })

  return {
    details,
    totals: { ...totals, totalText: numberToWords(totals.total) }
  }
}

export const saleUpdateStatus = async (idSale: number, status: boolean): Promise<ISale> => {
  try {
    // Existing sale
    await existIdValidation(idSale)

    // update sale status
    const updatedSale = await SaleModel.save({
      idSale, status
    })
    return updatedSale
  } catch (error) {
    logger.error('Update sale status: ' + (error as Error).name)
    throw error
  }
}

export const saleGetAll = async (filterParams: ISaleFilters, settings: IFilterSettings): Promise<IGetSalesResponse> => {
  try {
    const filters = getFilters(filterParams)
    const relations = getSaleIncludeFields(settings.include)

    const [sales, totalCount] = await Promise.all([
      SaleModel.find({
        where: filters,
        take: settings.limit,
        skip: settings.skip,
        order: settings.order,
        relations,
        select: getSelectIncludes()
      }),
      SaleModel.count({ where: filters, relations })
    ])
    // Total pages calc
    const totalPages = Math.ceil(totalCount / settings.limit)

    return {
      data: sales,
      total: totalCount,
      page: totalPages > 0 ? settings.page : 0,
      totalPages
    }
  } catch (error) {
    logger.error('Get sales: ' + (error as Error).name)
    throw error
  }
}

export const saleGetById = async (idSale: number, settings?: IFilterSettings): Promise<IGetSaleByIdResponse> => {
  try {
    const relations = settings?.include !== undefined ? getSaleIncludeFields(settings.include) : []
    const sale = await SaleModel.findOne({
      where: { idSale },
      relations,
      select: getSelectIncludes()
    })
    return { data: sale }
  } catch (error) {
    logger.error('Get sale by id: ' + (error as Error).name)
    throw error
  }
}

const getSelectIncludes = (): any => {
  return {
    branch: {
      name: true,
      phoneNumber: true,
      email: true,
      vatEnabled: true,
      dteActive: true,
      dteEnvironment: true
    },
    customer: {
      name: true,
      phoneNumbers: true,
      email: true,
      status: true
    },
    user: {
      username: true,
      phoneNumber: true,
      email: true,
      notifications: true,
      status: true
    },
    saleDetails: {
      idSaleDetail: true,
      idProduct: true,
      purchasePrice: true,
      price: true,
      quantity: true,
      affectedSale: true,
      discount: true,
      vat: true,
      userCommission: true,
      branchCommission: true
    }
  }
}

const getSaleIncludeFields = (includes?: string[]): string[] => {
  const relations = []
  if (includes !== undefined) {
    if (includes.includes('user')) {
      relations.push('user')
    }
    if (includes.includes('customer')) {
      relations.push('customer')
    }
    if (includes.includes('branch')) {
      relations.push('branch')
    }
    if (includes.includes('saleDetails')) {
      relations.push('saleDetails')
    }
  }
  return relations
}

const getFilters = (params: ISaleFilters): ISaleQueryParams => {
  const filters: ISaleQueryParams = {}

  applyFilter(filters, 'uuid', params.uuid)
  applyFilter(filters, 'idUser', params.idUser)
  applyFilter(filters, 'idCustomer', params.idCustomer)
  applyFilter(filters, 'idBranch', params.idBranch)
  applyFilter(filters, 'status', params.status)

  // Dates filters
  if (params.startDate !== undefined && params.endDate !== undefined) {
    filters.createdAt = Between(new Date(params.startDate), new Date(params.endDate))
  } else if (params.startDate !== undefined) {
    filters.createdAt = MoreThanOrEqual(new Date(params.startDate))
  } else if (params.endDate !== undefined) {
    filters.createdAt = LessThanOrEqual(new Date(params.endDate))
  }

  return filters
}

const existValuesValidations = async (
  idBranch: number, idCustomer: number
): Promise<{ branch: IBranchResponse, customer: ICustomer }> => {
  const [existBranch, existCustomer] = await Promise.all([
    branchGetById(idBranch), customerGetById(idCustomer)
  ])

  if (existBranch?.data === null) {
    throw new IDSaleBranchNotFoundError()
  }

  if (existCustomer?.data === null) {
    throw new IDSaleCustomerNotFoundError()
  }

  return {
    branch: existBranch.data,
    customer: existCustomer.data
  }
}

const existIdValidation = async (idSale: number): Promise<void> => {
  // Existing sale per ID
  const existSale = await SaleModel.findOne({
    select: ['idSale'], where: { idSale }
  })

  if (existSale === null) throw new IDSaleNotFoundError()
}
