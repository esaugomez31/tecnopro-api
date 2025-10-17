import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from "typeorm"

import { SaleModel, ProductModel } from "."

@Entity("sales_detail")
export class SaleDetailModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_sale_detail" })
  idSaleDetail?: number

  @Column({ type: "decimal", precision: 11, scale: 4, name: "purchase_price" })
  purchasePrice!: number

  @Column({ type: "decimal", precision: 11, scale: 4 })
  price!: number

  @Column({ type: "decimal", precision: 11, scale: 4 })
  quantity!: number

  @Column({ type: "decimal", precision: 11, scale: 4, name: "affected_sale" })
  affectedSale!: number

  @Column({ type: "decimal", precision: 11, scale: 4, default: 0.0 })
  discount: number = 0

  @Column({ type: "decimal", precision: 11, scale: 4, nullable: true })
  vat: number | null = null

  @Column({
    type: "decimal",
    precision: 11,
    scale: 2,
    default: 0.0,
    name: "user_commission",
  })
  userCommission: number = 0

  @Column({
    type: "decimal",
    precision: 11,
    scale: 2,
    default: 0.0,
    name: "branch_commission",
  })
  branchCommission: number = 0

  @Column({ type: "int", name: "id_product", nullable: true })
  idProduct: number | null = null

  @Column({ type: "int", name: "id_sale" })
  idSale!: number

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt?: Date

  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date

  // Relations
  @ManyToOne(() => SaleModel, (sale) => sale.saleDetails)
  @JoinColumn({ name: "id_sale" })
  sale?: SaleModel

  @ManyToOne(() => ProductModel, { nullable: true })
  @JoinColumn({ name: "id_product" })
  product?: ProductModel
}
