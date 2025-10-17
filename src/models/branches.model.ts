import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"

import { CountryModel, DepartmentModel, MunicipalityModel } from "."

@Entity("branches")
export class BranchModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_branch" })
  idBranch?: number

  @Column({ type: "varchar", length: 36, nullable: true })
  uuid: string | null = null

  @Column({ type: "varchar", length: 100 })
  name!: string

  @Column({ type: "text", nullable: true })
  description: string | null = null

  @Column({ name: "phone_number", type: "varchar", length: 17, nullable: true })
  phoneNumber: string | null = null

  @Column({ name: "email", type: "varchar", length: 100, nullable: true })
  email: string | null = null

  @Column({ name: "address", type: "varchar", length: 200, nullable: true })
  address: string | null = null

  @Column({ name: "vat_enabled", type: "tinyint", default: 0 })
  vatEnabled: boolean = false

  @Column({ name: "id_country", type: "int" })
  idCountry!: number

  @Column({ name: "id_department", type: "int" })
  idDepartment!: number

  @Column({ name: "id_municipality", type: "int" })
  idMunicipality!: number

  @ManyToOne(() => CountryModel, { eager: false })
  @JoinColumn({ name: "id_country" })
  country?: CountryModel

  @ManyToOne(() => DepartmentModel, { eager: false })
  @JoinColumn({ name: "id_department" })
  department?: DepartmentModel

  @ManyToOne(() => MunicipalityModel, { eager: false })
  @JoinColumn({ name: "id_municipality" })
  municipality?: MunicipalityModel

  @Column({ name: "dte_active", type: "tinyint", default: 0 })
  dteActive: boolean = false

  @Column({ name: "dte_environment", type: "enum", enum: ["01", "00"], default: "00" })
  dteEnvironment: "01" | "00" = "00"

  @Column({ name: "dte_api_jwt", type: "text", nullable: true })
  dteApiJwt: string | null = null

  @Column({ name: "dte_api_jwt_date", type: "datetime", nullable: true })
  dteApiJwtDate: Date | null = null

  @Column({ name: "dte_sender_nit", type: "varchar", length: 14, nullable: true })
  dteSenderNit: string | null = null

  @Column({ name: "dte_sender_nrc", type: "varchar", length: 8, nullable: true })
  dteSenderNrc: string | null = null

  @Column({ name: "dte_sender_email", type: "varchar", length: 100, nullable: true })
  dteSenderEmail: string | null = null

  @Column({ name: "dte_sender_phone", type: "varchar", length: 30, nullable: true })
  dteSenderPhone: string | null = null

  @Column({ name: "dte_activity_code", type: "varchar", length: 6, nullable: true })
  dteActivityCode: string | null = null

  @Column({ name: "dte_activity_desc", type: "varchar", length: 150, nullable: true })
  dteActivityDesc: string | null = null

  @Column({ name: "dte_sender_name", type: "varchar", length: 250, nullable: true })
  dteSenderName: string | null = null

  @Column({ name: "dte_sender_trade_name", type: "varchar", length: 150, nullable: true })
  dteSenderTradeName: string | null = null

  @Column({
    name: "dte_establishment",
    type: "enum",
    enum: ["01", "02", "04", "07"],
    default: "01",
  })
  dteEstablishment: "01" | "02" | "04" | "07" = "01"

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

  @Column({ name: "status", type: "tinyint", default: 1 })
  status: boolean = true
}
