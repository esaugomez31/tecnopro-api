import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, BaseEntity } from 'typeorm'
import { PermissionModel } from './permissions.model'

@Entity('role_permissions')
export class RolePermissionModel extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id_role_permission' })
    idRolePermission: number

  @Column({ name: 'id_role', nullable: true })
    idRole: number

  @Column({ name: 'id_permission', nullable: true })
    idPermission: number

  @Column({ type: 'datetime', nullable: true, name: 'creation_date' })
    creationDate: Date | null

  @ManyToOne(() => PermissionModel, permission => permission.idPermission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_permission' })
    permissionDetail: PermissionModel
}
