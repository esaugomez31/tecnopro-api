import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('users')
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_user' })
    idUser: number

  @Column({ type: 'varchar', length: 36, nullable: true })
    uuid: string | null

  @Column({ type: 'varchar', length: 40 })
    name: string

  @Column({ type: 'varchar', length: 20 })
    username: string

  @Column({ type: 'varchar', length: 70 })
    password: string

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'phone_number' })
    phoneNumber: string | null

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'whatsapp_number' })
    whatsappNumber: string | null

  @Column({ type: 'varchar', length: 85, nullable: true })
    email: string | null

  @Column({ type: 'tinyint', default: 0 })
    owner: boolean

  @Column({ type: 'tinyint', default: 0 })
    notifications: boolean

  @Column({ type: 'tinyint', default: 1 })
    status: boolean

  @Column({ type: 'datetime', nullable: true, name: 'last_login' })
    lastLogin: Date | null

  @Column({ type: 'varchar', default: 'America/El_Salvador', name: 'time_zone' })
    timeZone: string | null

  @Column({ type: 'int', nullable: true, name: 'id_rol' })
    idRol: number | null
}
