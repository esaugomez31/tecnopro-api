import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany } from 'typeorm'
import { DepartmentModel } from './index'

@Entity('countries')
export class CountryModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_country' })
    idCountry?: number

  @Column({ length: 50 })
    name: string

  @Column({ length: 3, nullable: true })
    code?: string

  @Column({ length: 10, nullable: true, name: 'zip_code' })
    zipCode?: string

  @Column({ length: 50, nullable: true, name: 'time_zone' })
    timeZone?: string

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status?: boolean

  @OneToMany(() => DepartmentModel, (department) => department.country)
    departments?: DepartmentModel[]
}
