import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Repository } from 'typeorm'
import { System, Permission, Role, User } from '@/entity'
import { InjectRepository } from '@nestjs/typeorm'
import { SystemService } from '@/system/system.service'
import { PermissionsService } from '@/permissions/permissions.service'
import { RolesService } from '@/roles/roles.service'
import {
  updateUserInformationPermissionName,
  administratorRoleName, rootName, rootPassword,
} from '@/const'
import { UsersService } from '@/users/users.service'
import * as env from '@/env'


interface UserSystem {
  systemId: number

  administratorRoleId: number

  updateUserInformationPermissionId: number
}

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  userSystem!: UserSystem

  constructor(
    @InjectRepository(System) private systemRepository: Repository<System>,
    @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private systemService: SystemService,
    private permissionsService: PermissionsService,
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // throw new Error()
    let system = await this.systemRepository.findOne({ name: env.userSystemName })
    if (!system) system = await this.systemService.create({ name: env.userSystemName })

    const systemId = system.id

    let updateUserInformationPermission = await this.permissionRepository.findOne({ name: updateUserInformationPermissionName, systemId })
    if (!updateUserInformationPermission) {
      updateUserInformationPermission = await this.permissionsService.create({
        name: updateUserInformationPermissionName,
        systemId,
      })
    }

    const updateUserInformationPermissionId = updateUserInformationPermission.id

    let administratorRole = await this.roleRepository.findOne({ name: administratorRoleName, systemId })
    if (!administratorRole) {
      administratorRole = await this.rolesService.create({ name: administratorRoleName, systemId })
      await this.rolesService.bind(administratorRole.id, [updateUserInformationPermissionId])
    }

    let root = await this.userRepository.findOne({ name: rootName })
    if (!root) {
      root = await this.usersService.create({
        name: rootName,
        nickname: rootName,
        password: rootPassword,
      })

      await this.usersService.bind(root.id, [administratorRole.id])
    }

    this.userSystem = {
      systemId,
      updateUserInformationPermissionId,
      administratorRoleId: administratorRole.id,
    }
  }
}
