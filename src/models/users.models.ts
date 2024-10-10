import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('users')
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
    id_user: number

  @Column({ type: 'varchar', length: 36, nullable: true })
    uuid: string | null

  @Column({ type: 'varchar', length: 40 })
    name: string

  @Column({ type: 'varchar', length: 20 })
    username: string

  @Column({ type: 'varchar', length: 70 })
    password: string

  @Column({ type: 'varchar', length: 15, nullable: true })
    phone_number: string | null

  @Column({ type: 'varchar', length: 15, nullable: true })
    whatsapp_number: string | null

  @Column({ type: 'varchar', length: 85, nullable: true })
    email: string | null

  @Column({ type: 'tinyint', default: 0 })
    owner: boolean

  @Column({ type: 'tinyint', default: 0 })
    notifications: boolean

  @Column({ type: 'tinyint', default: 1 })
    status: boolean

  @Column({ type: 'datetime', nullable: true })
    last_login: Date | null

  @Column({ type: 'varchar', default: 'America/El_Salvador' })
    time_zone: string | null

  @Column({ type: 'int', nullable: true })
    id_rol: number | null
}
