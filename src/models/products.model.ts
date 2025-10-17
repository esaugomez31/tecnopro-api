import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm"

import { BranchModel, BrandModel, CategoryModel, UserModel } from "."

@Entity("products")
export class ProductModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_product" })
  idProduct?: number

  @Column({ type: "varchar", length: 36, nullable: true })
  uuid: string | null = null

  @Column({ type: "varchar", length: 50 })
  name!: string

  @Column({ type: "varchar", length: 100, nullable: true })
  description: string | null = null

  @Column({ type: "varchar", length: 50, nullable: true })
  location: string | null = null

  @Column({ type: "varchar", length: 20, nullable: true })
  code: string | null = null

  @Column({ type: "varchar", length: 30, nullable: true })
  barcode: string | null = null

  @Column({ type: "tinyint", name: "barcode_generated", default: 0 })
  barcodeGenerated: boolean = false

  @Column({ type: "decimal", precision: 11, scale: 4 })
  price!: number

  @Column({
    type: "decimal",
    precision: 11,
    scale: 4,
    name: "purchase_price",
    default: 0.0,
  })
  purchasePrice: number = 0

  @Column({
    type: "enum",
    enum: ["store", "user"],
    default: "store",
    name: "purchased_by",
  })
  purchasedBy: "store" | "user" = "store"

  @Column({ type: "int", name: "dte_unit_measure", default: 59 })
  dteUnitMeasure: number = 59

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0.0,
    name: "user_commission_percentage",
  })
  userCommissionPercent: number = 0

  @Column({
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 100.0,
    name: "branch_commission_percentage",
  })
  branchCommissionPercent: number = 100

  @Column({ type: "decimal", precision: 11, scale: 4, name: "min_price", default: 0.0 })
  minPrice: number = 0

  @Column({ type: "decimal", precision: 11, scale: 4 })
  stock!: number

  @Column({ type: "varchar", length: 100, nullable: true, name: "image_url" })
  imageUrl: string | null = null

  @Column({ type: "int", name: "id_branch" })
  idBranch!: number

  @Column({ type: "int", name: "id_brand", nullable: true })
  idBrand: number | null = null

  @Column({ type: "int", name: "id_category", nullable: true })
  idCategory: number | null = null

  @Column({ type: "int", name: "id_user", nullable: true })
  idUser: number | null = null

  @ManyToOne(() => BranchModel)
  @JoinColumn({ name: "id_branch" })
  branch?: BranchModel

  @ManyToOne(() => BrandModel, { nullable: true })
  @JoinColumn({ name: "id_brand" })
  brand?: BrandModel

  @ManyToOne(() => CategoryModel, { nullable: true })
  @JoinColumn({ name: "id_category" })
  category?: CategoryModel

  @ManyToOne(() => UserModel, { nullable: true })
  @JoinColumn({ name: "id_user" })
  user?: UserModel

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

  @Column({ type: "tinyint", default: 1 })
  status: boolean = true
}
