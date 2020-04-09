import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { User, Role, Permission, System } from './entity'
import { PermissionsModule } from './permissions/permissions.module'
import { RolesModule } from './roles/roles.module'
import { SystemModule } from './system/system.module'
import { AdminModule } from './admin/admin.module'
import * as env from './env'


const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUsername,
  password: env.dbPassword,
  database: env.dbDatabase,
  entities: [User, Role, Permission, System],
  synchronize: true,
}

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UsersModule,
    PermissionsModule,
    RolesModule,
    SystemModule,
    AdminModule,
  ],
  controllers: [],
})
export class AppModule {}
