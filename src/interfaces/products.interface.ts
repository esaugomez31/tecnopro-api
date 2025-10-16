import { FindOperator } from "typeorm"
import { Request } from "express"
import type { ParsedQs } from "qs"

import { IFilterSettings, IBranch, IBrand, ICategory, IUser } from "."

export enum ProductPermEnum {
  VIEWLIST = "view_list",
  CREATE = "create",
  UPDATE = "update",
  UPDATESTATUS = "update_status",
  SEEPURCHASEDATA = "see_purchase_data",
  UPDTPURCHASEDATA = "update_purchase_data",
  UPDTCOMMISSIONS = "update_commissions",
  UPDTSTOCK = "update_stock",
  UPDTPRICE = "update_price",
}

// Main product interface
export interface IProduct {
  idProduct?: number
  uuid?: string
  name: string
  description?: string
  location?: string
  code?: string
  barcode?: string
  barcodeGenerated: number
  price: number
  purchasePrice?: number
  purchasedBy?: "store" | "user"
  dteUnitMeasure: number
  userCommissionPercent?: number
  branchCommissionPercent?: number
  minPrice: number
  stock: number
  imageUrl?: string
  idBranch: number
  idBrand?: number
  idCategory?: number
  idUser?: number
  branch?: IBranch
  brand?: IBrand
  category?: ICategory
  user?: IUser
  createdAt?: Date
  updatedAt?: Date
  status?: boolean
}

// Allow filter params from API
export interface IProductFilters {
  name?: string
  description?: string
  uuid?: string
  location?: string
  code?: string
  barcode?: string
  idBranch?: number
  idBrand?: number
  idCategory?: number
  idUser?: number
  status?: boolean
}

// Filter options to product in typeorm
export interface IProductQueryParams
  extends Omit<IProductFilters, "name" | "description" | "location" | "code"> {
  name?: FindOperator<string> | string
  description?: FindOperator<string> | string
  location?: FindOperator<string> | string
  code?: FindOperator<string> | string
}

// Multi products response interface
export interface IGetProductsResponse {
  data: IProduct[]
  total: number
  page: number
  totalPages: number
}

// Unique product response
export interface IGetProductByIdResponse {
  data: IProduct | null
}

// Custom request to type products get controllers
export interface IProductGetCustomRequest extends Request {
  query: IProductFilters & IFilterSettings & ParsedQs
}

// Custom request to type products create controllers
export interface IProductCommonRequest extends Request {
  body: IProduct
}
