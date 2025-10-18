import { ISale, IProduct } from "."

export interface ISaleDetail {
  idSaleDetail?: number
  purchasePrice: number
  price: number
  quantity: number
  affectedSale: number
  discount: number
  vat?: number | null
  userCommission: number
  branchCommission: number
  idProduct?: number | null
  idSale: number
  createdAt?: Date
  updatedAt?: Date

  // Relaciones
  sale?: ISale
  product?: IProduct
}
