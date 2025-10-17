import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from "typeorm"

import { DepartmentModel } from "../index"

@Entity("countries")
export class CountryModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_country" })
  idCountry?: number

  @Column({ type: "varchar", length: 50 })
  name!: string

  @Column({ type: "varchar", length: 3, nullable: true })
  code: string | null = null

  @Column({ type: "varchar", length: 10, nullable: true, name: "zip_code" })
  zipCode: string | null = null

  @Column({ type: "varchar", length: 50, nullable: true, name: "time_zone" })
  timeZone: string | null = null

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

  @OneToMany(() => DepartmentModel, (department) => department.country)
  departments: DepartmentModel[] = []
}
