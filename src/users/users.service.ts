import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User, Role } from '@/entity'
import { Repository, In } from 'typeorm'
import { CreateUserDto, CreateRootDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginDto } from './dto/login.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AuthorizationPayload } from './interfaces/authorization-payload'
import { jwtSecret } from '@/env'
import { UserNotFoundException } from './exception/user-not-found.exception'
import { Pagination } from '@/dto/pagination.dto'
import { Page } from '@/interface/page.interface'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async findAll(page: Pagination): Promise<Page<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .take(page.limit)
      .skip(page.offset)

    return {
      limit: page.limit,
      offset: page.offset,
      items: await queryBuilder.getMany(),
      total: await queryBuilder.getCount(),
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id)
    if (!user) throw new HttpException('User not founded', HttpStatus.NOT_FOUND)
    return user
  }

  async create(createUserDto: CreateUserDto | CreateRootDto): Promise<User> {
    const saltRounds = 10
    const hash = await bcrypt.hash(createUserDto.password, saltRounds)

    const user = new User()
    user.nickname = createUserDto.nickname
    if ('name' in createUserDto && createUserDto.name) user.name = createUserDto.name
    if ('avatar' in createUserDto && createUserDto.avatar) user.avatar = createUserDto.avatar
    user.password = hash
    if ('phone' in createUserDto) user.phone = createUserDto.phone
    if ('email' in createUserDto) user.email = createUserDto.email
    return await this.userRepository.save(user)
  }

  async update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.name) user.name = updateUserDto.name
    if (updateUserDto.avatar) user.avatar = updateUserDto.avatar
    if (updateUserDto.phone) user.phone = updateUserDto.phone
    if (updateUserDto.email) user.email = updateUserDto.email
    return await this.userRepository.save(user)
  }

  async delete(user: User): Promise<User> {
    return await this.userRepository.remove(user)
  }

  async login(loginDto: LoginDto): Promise<string> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.phone = :username', loginDto)
      .orWhere('user.email = :username', loginDto)
      .orWhere('user.name = :username', loginDto)

    const user = await queryBuilder.getOne()

    if (!user) throw new HttpException('username or password error', HttpStatus.UNAUTHORIZED)
    const authorized = await bcrypt.compare(loginDto.password, user.password)
    if (!authorized) throw new HttpException('username or password error', HttpStatus.UNAUTHORIZED)

    const payload: AuthorizationPayload = { userId: user.id }
    return `Bearer ${jwt.sign(payload, jwtSecret)}`
  }

  async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    const authorized = await bcrypt.compare(updatePasswordDto.oldPassword, user.password)
    if (!authorized) throw new HttpException('password error', HttpStatus.UNAUTHORIZED)
    user.password = updatePasswordDto.newPassword
    return await this.userRepository.save(user)
  }

  async bind(userId: number, roleIds: number[]): Promise<User> {
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.id = :userId', { userId })
      .select('user.id')
      .addSelect('role.id')
      .getOne()

    if (!user) throw new UserNotFoundException()
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
      select: ['id'],
    })
    user.roles.push(...roles)

    return await this.userRepository.save(user)
  }
}
