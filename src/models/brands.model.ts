import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"

@Entity("brands")
export class BrandModel extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_brand" })
  idBrand?: number

  @Column({ type: "varchar", length: 36, nullable: true })
  uuid: string | null = null

  @Column({ type: "varchar", length: 50 })
  name!: string

  @Column({ type: "text", nullable: true })
  description: string | null = null

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
}
