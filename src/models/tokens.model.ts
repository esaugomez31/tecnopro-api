import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"

import { UserModel } from "."

@Entity("tokens")
export class TokenModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_token" })
  idToken?: number

  @Column({ type: "text", nullable: true })
  token: string | null = null

  @Column({ type: "int", name: "id_user" })
  idUser!: number

  @Column({ type: "datetime", name: "expired_at", nullable: true, default: null })
  expiredAt: Date | null = null

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt?: Date

  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date

  @Column({ type: "tinyint", default: 1 })
  status: boolean = true

  @ManyToOne(() => UserModel, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "id_user" })
  user?: UserModel
}
