import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'
import { UserRoleEnum } from '../interfaces'

@Entity('users')
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_user' })
    idUser?: number

  @Column({ type: 'varchar', length: 36, nullable: true })
    uuid: string | null

  @Column({ type: 'varchar', length: 40 })
    name: string

  @Column({ type: 'varchar', length: 20 })
    username: string

  @Column({ type: 'varchar', length: 70 })
    password: string

  @Column({ type: 'varchar', length: 17, nullable: true, name: 'phone_number' })
    phoneNumber: string | null

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'whatsapp_number' })
    whatsappNumber: string | null

  @Column({ type: 'varchar', length: 85, nullable: true })
    email: string

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER, nullable: true })
    type?: UserRoleEnum

  @Column({ type: 'tinyint', default: 0 })
    notifications: boolean

  @Column({ type: 'datetime', nullable: true, name: 'last_login' })
    lastLogin: Date | null

  @Column({ type: 'varchar', default: 'America/El_Salvador', name: 'time_zone' })
    timeZone?: string | null

  @Column({ name: 'id_role', nullable: true })
    idRole?: number

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status: boolean
}
