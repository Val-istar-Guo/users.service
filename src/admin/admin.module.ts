import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { SystemModule } from '@/system/system.module'
import { PermissionsModule } from '@/permissions/permissions.module'
import { RolesModule } from '@/roles/roles.module'
import { AdminService } from './admin.service'
import { Permission, Role, System, User } from '@/entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '@/users/users.module'

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  imports: [
    SystemModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    TypeOrmModule.forFeature([Permission, Role, System, User]),
  ],
})
export class AdminModule {}
