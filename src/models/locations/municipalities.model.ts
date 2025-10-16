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

import { DepartmentModel } from "./departments.model"

@Entity("municipalities")
export class MunicipalityModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id_municipality" })
  idMunicipality?: number

  @Column({ length: 85 })
  name: string

  @Column({ length: 10, nullable: true, name: "zip_code" })
  zipCode?: string

  @Column({ length: 2, nullable: true, name: "dte_code" })
  dteCode?: string

  @Column({ name: "id_country", nullable: true })
  idCountry?: number

  @Column({ name: "id_department" })
  idDepartment: number

  @ManyToOne(() => DepartmentModel, (department) => department.municipalities)
  @JoinColumn({ name: "id_department" })
  department?: DepartmentModel

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date

  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date

  @Column({ type: "tinyint", default: 1 })
  status?: boolean
}
