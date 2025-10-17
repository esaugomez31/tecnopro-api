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

import { DepartmentModel, CountryModel } from "../index"

@Entity("municipalities")
export class MunicipalityModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_municipality" })
  idMunicipality?: number

  @Column({ type: "varchar", length: 85 })
  name!: string

  @Column({ type: "varchar", length: 10, nullable: true, name: "zip_code" })
  zipCode: string | null = null

  @Column({ type: "varchar", length: 2, nullable: true, name: "dte_code" })
  dteCode: string | null = null

  @Column({ type: "int", name: "id_country", nullable: true })
  idCountry: number | null = null

  @Column({ type: "int", name: "id_department" })
  idDepartment!: number

  @ManyToOne(() => CountryModel, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "id_country" })
  country?: CountryModel

  @ManyToOne(() => DepartmentModel, (department) => department.municipalities, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "id_department" })
  department?: DepartmentModel

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
