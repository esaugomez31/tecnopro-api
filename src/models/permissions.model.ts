import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
} from "typeorm"

import { SystemPageEnum } from "../interfaces"

import { RoleModel } from "."

@Entity("permissions")
export class PermissionModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_permission" })
  idPermission?: number

  @Column({ type: "enum", enum: SystemPageEnum, name: "system_page" })
  systemPage: SystemPageEnum

  @Column({ type: "varchar", length: 25, name: "permission_name" })
  permissionName: string

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
  status: boolean

  @ManyToMany(() => RoleModel, (role) => role.permissions)
  roles: RoleModel[]
}
