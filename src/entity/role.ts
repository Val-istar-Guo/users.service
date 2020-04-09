import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm'
import { User } from './user'
import { System } from './system'
import { Permission } from './permission'


@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column({ default: '' })
  description!: string

  @ManyToMany(() => User, user => user.roles)
  users!: User[]

  @Column()
  systemId!: number

  @ManyToOne(() => System, system => system.roles)
  system!: System

  @ManyToMany(() => Permission, permission => permission)
  @JoinTable()
  permissions!: Permission[]
}
