import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('roles')
export class RoleModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_role' })
    idRole?: number

  @Column({ type: 'varchar', length: 25 })
    name: string

  @Column({ type: 'tinyint', default: 1 })
    status: boolean
}
