import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Role } from './role'
import { Permission } from './permission'

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  name!: string

  @Column({ default: '' })
  title!: string

  @OneToMany(() => Role, role => role.system)
  roles!: Role[]

  @OneToMany(() => Permission, permission => permission.system)
  permissions!: Permissions[]
}
