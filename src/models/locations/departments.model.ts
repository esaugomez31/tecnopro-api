import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm'
import { MunicipalityModel, CountryModel } from '..'

@Entity('departments')
export class DepartmentModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_department' })
    idDepartment?: number

  @Column({ length: 85 })
    name: string

  @Column({ length: 10, nullable: true, name: 'zip_code' })
    zipCode?: string

  @Column({ length: 2, nullable: true, name: 'dte_code' })
    dteCode?: string

  @Column({ name: 'id_country' })
    idCountry: number

  @ManyToOne(() => CountryModel, (country) => country.departments)
  @JoinColumn({ name: 'id_country' })
    country?: CountryModel

  @OneToMany(() => MunicipalityModel, (municipality) => municipality.department)
    municipalities?: MunicipalityModel[]

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status?: boolean
}
