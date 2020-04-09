import { Entity, PrimaryGeneratedColumn, ValueTransformer, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, Index } from 'typeorm'
import { Exclude } from 'class-transformer'
import { Role } from './role'
import { identity } from 'ramda'


function replaceNullTo<T>(value: T): ValueTransformer {
  return {
    from(v: any) {
      if (v === null) return value
      return v
    },
    to: identity
  }
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, length: 100, default: '' })
  name!: string

  @Column({ length: 100 })
  nickname!: string

  @Column({ nullable: true, transformer: replaceNullTo('https://miaooo-users-service.oss-cn-shanghai.aliyuncs.com/users/default_avatar.png') })
  avatar!: string

  @Column({ length: 100 })
  @Exclude()
  password!: string

  @Column({ default: 'ZZ' })
  country!: string

  @Index('index_email')
  @Column({ unique: true, length: 100, default: '' })
  email!: string

  @Index('index_phone')
  @Column({ unique: true, length: 24, default: '' })
  phone!: string

  @Column({ nullable: true })
  loginAt!: Date

  @CreateDateColumn()
  createAt!: Date

  @UpdateDateColumn()
  updateAt!: Date

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles!: Role[]
}
