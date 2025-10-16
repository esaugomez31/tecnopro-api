import { ISale, IProduct } from "."

export interface ISaleDetail {
  idSaleDetail?: number
  purchasePrice: number
  price: number
  quantity: number
  affectedSale: number
  discount: number
  vat?: number
  userCommission: number
  branchCommission: number
  idProduct: number
  idSale: number
  createdAt?: Date
  updatedAt?: Date

  // Relaciones
  sale?: ISale
  product?: IProduct
}
