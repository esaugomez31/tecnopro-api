import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  BaseEntity,
} from "typeorm"

import { PermissionModel } from "./permissions.model"

import { RoleModel } from "."

@Entity("role_permissions")
export class RolePermissionModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_role_permission" })
  idRolePermission?: number

  @Column({ type: "int", name: "id_role", nullable: true })
  idRole: number | null = null

  @Column({ type: "int", name: "id_permission", nullable: true })
  idPermission: number | null = null

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

  @ManyToOne(() => RoleModel, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_role" })
  role?: RoleModel

  @ManyToOne(() => PermissionModel, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id_permission" })
  permission?: PermissionModel
}
