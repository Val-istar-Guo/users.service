import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Role, Permission } from '@/entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, SelectQueryBuilder } from 'typeorm'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleNotFoundException } from './exceptions/role-not-found.exception'
import { RolesServiceFilter } from './dto/filter.dto'
import { Pagination } from '@/dto/pagination.dto'
import { Page } from '@/interface/page.interface'



@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
  ) {}

  private setFilter<T>(queryBuilder: SelectQueryBuilder<T>, filter: RolesServiceFilter): void {
    if (filter.systemId) {
      queryBuilder.where('role.systemId = :systemId', filter)
    }

    if (filter.userId) {
      queryBuilder
        .leftJoin('role.users', 'user')
        .where('user.id = :userId', filter)
    }
  }

  public async findAll(page: Pagination, filter: RolesServiceFilter = {}): Promise<Page<Role>> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role')
      .take(page.limit)
      .skip(page.offset)

    this.setFilter(queryBuilder, filter)
    return {
      offset: page.offset,
      limit: page.limit,
      items: await queryBuilder.getMany(),
      total: await queryBuilder.getCount(),
    }
  }

  public async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne(id)
    if (!role) throw new HttpException('Role not founded', HttpStatus.NOT_FOUND)
    return role
  }


  public async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role()
    role.name = createRoleDto.name
    role.systemId = createRoleDto.systemId
    return await this.roleRepository.save(role)
  }

  public async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne(id)
    if (!role) throw new HttpException('Role not founded', HttpStatus.NOT_FOUND)

    if (updateRoleDto.name) role.name = updateRoleDto.name
    return await this.roleRepository.save(role)
  }

  public async delete(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne(id)
    if (!role) throw new HttpException('Role not founded', HttpStatus.NOT_FOUND)

    return await this.roleRepository.remove(role)
  }

  public async bind(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.roleRepository.createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('role.id = :roleId', { roleId })
      .select('role.id')
      .addSelect('permission.id')
      .getOne()

    if (!role) throw new RoleNotFoundException()

    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
      select: ['id'],
    })

    role.permissions.push(...permissions)
    return await this.roleRepository.save(role)
  }

  public async unbind(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.roleRepository.createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('role.id = :roleId', { roleId })
      .select('role.id')
      .addSelect('permission.id')
      .getOne()

    if (!role) throw new RoleNotFoundException()
    role.permissions = role.permissions.filter(permission => !permissionIds.includes(permission.id))
    return await this.roleRepository.save(role)
  }
}
