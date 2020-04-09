import { Module } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Permission, Role } from '@/entity'

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role])],
  providers: [PermissionsService],
  controllers: [PermissionsController],
  exports: [PermissionsService],
})
export class PermissionsModule {}
