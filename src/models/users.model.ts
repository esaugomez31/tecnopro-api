import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from "typeorm"

import { UserRoleEnum } from "../interfaces"

import { RoleModel } from "."

@Entity("users")
export class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_user" })
  idUser?: number

  @Column({ type: "varchar", length: 36, nullable: true })
  uuid: string | null = null

  @Column({ type: "varchar", length: 40 })
  name!: string

  @Column({ type: "varchar", length: 20 })
  username!: string

  @Column({ type: "varchar", length: 255 })
  password!: string

  @Column({ type: "varchar", length: 17, nullable: true, name: "phone_number" })
  phoneNumber: string | null = null

  @Column({ type: "varchar", length: 15, nullable: true, name: "whatsapp_number" })
  whatsappNumber: string | null = null

  @Column({ type: "varchar", length: 100, nullable: true })
  email: string | null = null

  @Column({
    type: "enum",
    enum: UserRoleEnum, // 'admin' | 'sub_admin' | 'user'
    default: UserRoleEnum.USER,
    nullable: true,
  })
  type?: UserRoleEnum

  @Column({ type: "tinyint", default: 0 })
  notifications: boolean = false

  @Column({ type: "datetime", nullable: true, name: "last_login" })
  lastLogin: Date | null = null

  @Column({
    type: "varchar",
    length: 50,
    default: "America/El_Salvador",
    name: "time_zone",
  })
  timeZone: string = "America/El_Salvador"

  @Column({ name: "id_role", type: "int", nullable: true })
  idRole: number | null = null

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

  @ManyToOne(() => RoleModel, (role) => role.users)
  @JoinColumn({ name: "id_role" })
  role?: RoleModel
}
