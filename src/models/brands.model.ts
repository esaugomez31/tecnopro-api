import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('brands')
export class BrandModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_brand' })
    idBrand?: number

  @Column({ type: 'varchar', length: 36, nullable: true })
    uuid: string

  @Column({ type: 'varchar', length: 50, nullable: true })
    name: string

  @Column({ type: 'text', nullable: true })
    description: string

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status?: boolean
}
