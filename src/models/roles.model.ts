import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'

@Entity('roles')
export class RoleModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id_role' })
    idRole?: number

  @Column({ type: 'varchar', length: 25 })
    name: string

  @Column({ type: 'text', nullable: true })
    description: string

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status: boolean
}
