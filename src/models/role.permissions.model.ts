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

@Entity("role_permissions")
export class RolePermissionModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "id_role_permission" })
  idRolePermission: number

  @Column({ name: "id_role", nullable: true })
  idRole: number

  @Column({ name: "id_permission", nullable: true })
  idPermission: number

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

  @ManyToOne(() => PermissionModel, (permission) => permission.idPermission, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "id_permission" })
  permissionDetail: PermissionModel
}
