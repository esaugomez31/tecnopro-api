import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('tokens')
export class TokenModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_token' })
    idToken?: number

  @Column({ type: 'text' })
    token: string

  @Column({ type: 'int', name: 'id_user' })
    idUser: number

  @Column({ type: 'datetime', name: 'expired_at', nullable: true, default: null })
    expiredAt: Date

  @CreateDateColumn({ name: 'created_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt?: Date

  @Column({ type: 'tinyint', default: 1 })
    status?: boolean
}
