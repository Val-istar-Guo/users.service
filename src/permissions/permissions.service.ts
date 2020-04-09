import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder, In } from 'typeorm'
import { Permission, Role } from '@/entity'
import { CreatePermissionDto } from './dto/create-permissions.dto'
import { UpdatePermissionDto } from './dto/update-permissions.dto'
import { PermissionNotFoundException } from './exceptions/permission-not-found.exception'
import { Page } from '@/interface/page.interface'
import { Pagination } from '@/dto/pagination.dto'
import { PermissionsServiceFilter } from './dto/filter.dto'


@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>
  ) {}

  private setFilter<T>(queryBuilder: SelectQueryBuilder<T>, filter: PermissionsServiceFilter): void {
    if (filter.systemIds || filter.roleIds) {
      queryBuilder
        .leftJoin('permission.roles', 'role')
    }

    if (filter.roleIds) {
      queryBuilder
        .where('role.id IN (:...roleIds)', filter)
    }

    if (filter.systemIds) {
      queryBuilder
        .where('role.systemId IN (:...systemIds)', filter)
    }

    if (filter.userIds) {
      queryBuilder
        .leftJoin('role.users', 'user')
        .where('user.id IN (:...userIds)', filter)
    }
  }

  public async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne(id)
    if (!permission) throw new PermissionNotFoundException()

    return permission
  }

  public async findAll(page: Pagination, filter: PermissionsServiceFilter = {}): Promise<Page<Permission>> {
    // this.permissionRepository.
    const queryBuilder = await this.permissionRepository.createQueryBuilder('permission')
      .take(page.limit)
      .skip(page.offset)

    this.setFilter(queryBuilder, filter)
    return {
      limit: page.limit,
      offset: page.offset,
      items: await queryBuilder.getMany(),
      total: await queryBuilder.getCount()
    }
  }

  public async create(createPermissionsDto: CreatePermissionDto): Promise<Permission> {
    const permission = new Permission()
    permission.name = createPermissionsDto.name
    permission.systemId = createPermissionsDto.systemId

    if (createPermissionsDto.crontrollers) {
      permission.crontrollers = createPermissionsDto.crontrollers
    }

    return await this.permissionRepository.save(permission)
  }

  public async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.permissionRepository.findOne(id)
    if (!permission) throw new PermissionNotFoundException()
    if (updatePermissionDto.name) permission.name = updatePermissionDto.name
    if (updatePermissionDto.controllers) permission.crontrollers = updatePermissionDto.controllers

    return permission
  }

  public async delete(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne(id)
    if (!permission) throw new PermissionNotFoundException()
    return await this.permissionRepository.remove(permission)
  }

  public async hasOneOf(permissionIds: number[], filter: PermissionsServiceFilter): Promise<boolean> {
    const queryBuilder = this.permissionRepository.createQueryBuilder('permission')
      .where('permission.id IN (:..permissionIds)', { permissionIds })

    this.setFilter(queryBuilder, filter)
    const count = await queryBuilder.getCount()
    return !!count
  }

  public async bind(permissionId: number, roleIds: number[]): Promise<Permission> {
    const permission = await this.permissionRepository.findOne(permissionId, {
      relations: ['roles'],
      select: ['id']
    })
    if (!permission) throw new PermissionNotFoundException()

    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) },
      select: ['id']
    })
    permission.roles.push(...roles)
    return await this.permissionRepository.save(permission)
  }

  public async unbind(permissionId: number, roleIds: number[]): Promise<Permission> {
    const permission = await this.permissionRepository.findOne(permissionId, {
      relations: ['roles'],
      select: ['id', 'roles'],
    })
    if (!permission) throw new PermissionNotFoundException()

    permission.roles = permission.roles.filter(role => !roleIds.includes(role.id))
    return await this.permissionRepository.save(permission)
  }
}
