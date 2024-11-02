import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { CountryModel, DepartmentModel, MunicipalityModel } from '.'

@Entity('branches')
export class BranchModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_branch' })
    idBranch?: number

  @Column({ type: 'varchar', length: 36, nullable: true })
    uuid: string | null

  @Column({ name: 'name', type: 'varchar', length: 100 })
    name: string

  @Column({ type: 'text', nullable: true })
    description?: string

  @Column({ name: 'phone_number', type: 'varchar', nullable: true, length: 15 })
    phoneNumber?: string

  @Column({ name: 'email', type: 'varchar', nullable: true, length: 100 })
    email?: string

  @Column({ name: 'address', type: 'varchar', nullable: true, length: 255 })
    address?: string

  @Column({ name: 'id_country', type: 'int' })
    idCountry: number

  @Column({ name: 'id_department', type: 'int' })
    idDepartment: number

  @Column({ name: 'id_municipality', type: 'int' })
    idMunicipality: number

  @ManyToOne(() => CountryModel, { eager: false })
  @JoinColumn({ name: 'id_country' })
    country?: CountryModel

  @ManyToOne(() => DepartmentModel, { eager: false })
  @JoinColumn({ name: 'id_department' })
    department?: DepartmentModel

  @ManyToOne(() => MunicipalityModel, { eager: false })
  @JoinColumn({ name: 'id_municipality' })
    municipality?: MunicipalityModel

  @Column({ name: 'dte_active', type: 'tinyint', default: 0 })
    dteActive?: boolean

  @Column({
    name: 'dte_environment',
    type: 'enum',
    enum: ['01', '00'],
    default: '00'
  })
    dteEnvironment?: '01' | '00' // 01: PRODUCTION, 00: TEST

  @Column({ name: 'dte_api_jwt', type: 'text', nullable: true })
    dteApiJwt?: string

  @Column({ name: 'dte_api_jwt_date', type: 'datetime', nullable: true })
    dteApiJwtDate?: Date

  @Column({ name: 'dte_control_number', type: 'varchar', length: 31, nullable: true })
    dteControlNumber?: string

  @Column({ name: 'dte_sender_nit', type: 'varchar', length: 14, nullable: true })
    dteSenderNit?: string

  @Column({ name: 'dte_sender_nrc', type: 'varchar', length: 8, nullable: true })
    dteSenderNrc?: string

  @Column({ name: 'dte_sender_email', type: 'varchar', length: 100, nullable: true })
    dteSenderEmail?: string

  @Column({ name: 'dte_sender_phone', type: 'varchar', length: 30, nullable: true })
    dteSenderPhone?: string

  @Column({ name: 'dte_activity_code', type: 'varchar', length: 6, nullable: true })
    dteActivityCode?: string

  @Column({ name: 'dte_activity_desc', type: 'varchar', length: 150, nullable: true })
    dteActivityDesc?: string

  @Column({ name: 'dte_sender_name', type: 'varchar', length: 250, nullable: true })
    dteSenderName?: string

  @Column({ name: 'dte_sender_trade_name', type: 'varchar', length: 150, nullable: true })
    dteSenderTradeName?: string

  @Column({
    name: 'dte_establishment',
    type: 'enum',
    enum: ['01', '02', '03', '04'],
    default: '01'
  })
    dteEstablishment?: '01' | '02' | '03' | '04' // 01: SUCURSAL, 02: CASA MATRIZ, 03: BODEGA, 04: PATIO

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ name: 'status', type: 'tinyint', default: 1 })
    status?: boolean
}
