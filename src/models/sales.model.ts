import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"

import { UserModel, CustomerModel, BranchModel, SaleDetailModel } from "."

@Entity("sales")
export class SaleModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_sale" })
  idSale?: number

  @Column({ type: "varchar", length: 36, nullable: true })
  uuid: string | null = null

  @Column({ type: "varchar", length: 25, nullable: true, name: "invoice_type" })
  invoiceType: string | null = null

  @Column({ type: "decimal", precision: 11, scale: 2, nullable: true })
  paid: number | null = null

  @Column({ type: "decimal", precision: 11, scale: 2 })
  total!: number

  @Column({ type: "decimal", precision: 11, scale: 2, nullable: true })
  vat: number | null = null

  @Column({ type: "decimal", precision: 11, scale: 2 })
  subtotal!: number

  @Column({
    type: "decimal",
    precision: 11,
    scale: 2,
    default: 0.0,
    name: "total_profit",
  })
  totalProfit: number = 0

  @Column({
    type: "decimal",
    precision: 11,
    scale: 2,
    default: 0.0,
    name: "gross_profit",
  })
  grossProfit: number = 0

  @Column({
    type: "decimal",
    precision: 11,
    scale: 2,
    default: 0.0,
    name: "users_commission",
  })
  usersCommission: number = 0

  @Column({
    type: "decimal",
    precision: 11,
    scale: 2,
    default: 0.0,
    name: "shipping_cost",
  })
  shippingCost: number = 0

  @Column({ type: "varchar", length: 255, nullable: true, name: "customer_notes" })
  customerNotes: string | null = null

  @Column({ type: "varchar", length: 200, nullable: true, name: "total_text" })
  totalText: string | null = null

  @Column({ type: "tinyint", default: 0, name: "refunded" })
  refunded: boolean = false

  @Column({ type: "tinyint", default: 0, name: "contingency_status" })
  contingencyStatus: boolean = false

  @Column({ type: "varchar", length: 20, nullable: true, name: "dte_status" })
  dteStatus: string | null = null

  @Column({ type: "varchar", length: 31, nullable: true, name: "dte_control_number" })
  dteControlNumber: string | null = null

  @Column({ type: "datetime", nullable: true, name: "dte_request_sent_at" })
  dteRequestSentAt: Date | null = null

  @Column({ type: "text", nullable: true, name: "dte_observations" })
  dteObservations: string | null = null

  @Column({
    name: "dte_operation_condition",
    type: "enum",
    enum: ["1", "2", "3"],
    default: "1",
  })
  dteOperationCondition: "1" | "2" | "3" = "1"

  @Column({ type: "varchar", length: 100, nullable: true, name: "dte_seal" })
  dteSeal: string | null = null

  @Column({ type: "int", name: "id_user" })
  idUser!: number

  @Column({ type: "int", name: "id_customer", nullable: true })
  idCustomer: number | null = null

  @Column({ type: "int", name: "id_branch", nullable: true })
  idBranch: number | null = null

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

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: "id_user" })
  user?: UserModel

  @ManyToOne(() => CustomerModel, { nullable: true })
  @JoinColumn({ name: "id_customer" })
  customer?: CustomerModel

  @ManyToOne(() => BranchModel, { nullable: true })
  @JoinColumn({ name: "id_branch" })
  branch?: BranchModel

  @OneToMany(() => SaleDetailModel, (saleDetail) => saleDetail.sale)
  saleDetails: SaleDetailModel[] = []
}
