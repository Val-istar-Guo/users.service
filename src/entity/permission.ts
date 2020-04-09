import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, BeforeInsert } from 'typeorm'
import { Role } from './role'
import { PermissionController } from '@/permissions/interfaces/permission-controller.interface'
import { System } from './system'


@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ default: '' })
  description!: string

  /**
   * 权限的控制器信息
   * 可用于客户端自定义实现权限配置
   * 需要业务系统中添加中间价解析控制器内容
   * 业务系统自己实现控制逻辑
   */
  @Column({ type: 'simple-json' })
  crontrollers!: PermissionController[]

  @Column()
  systemId!: number

  @ManyToOne(() => System, system => system.permissions)
  system!: System

  @ManyToMany(() => Role, role => role.permissions)
  roles!: Role[]

  @BeforeInsert()
  setDefaulted(): void {
    if (!this.crontrollers) this.crontrollers = []
  }
}
