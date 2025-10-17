import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("customers")
export class CustomerModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_customer" })
  idCustomer?: number

  @Column({ type: "varchar", length: 36, nullable: true })
  uuid: string | null = null

  @Column({ name: "name", type: "varchar", length: 75, nullable: true })
  name: string | null = null

  @Column({ name: "trade_name", type: "varchar", length: 150, nullable: true })
  tradeName: string | null = null

  @Column({ name: "dui", type: "varchar", length: 30, nullable: true })
  dui: string | null = null

  @Column({ name: "nit", type: "varchar", length: 14, nullable: true })
  nit: string | null = null

  @Column({ name: "nrc", type: "varchar", length: 8, nullable: true })
  nrc: string | null = null

  @Column({ name: "phone_numbers", type: "varchar", length: 30, nullable: true })
  phoneNumbers: string | null = null

  @Column({ name: "whatsapp_number", type: "varchar", length: 17, nullable: true })
  whatsappNumber: string | null = null

  @Column({ name: "email", type: "varchar", length: 100, nullable: true })
  email: string | null = null

  @Column({ name: "address", type: "varchar", length: 200, nullable: true })
  address: string | null = null

  @Column({ name: "id_country", type: "int", nullable: true })
  idCountry: number | null = null

  @Column({ name: "id_department", type: "int", nullable: true })
  idDepartment: number | null = null

  @Column({ name: "id_municipality", type: "int", nullable: true })
  idMunicipality: number | null = null

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
