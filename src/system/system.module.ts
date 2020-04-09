import { Module } from '@nestjs/common'
import { SystemService } from './system.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { System } from '@/entity'
import { SystemController } from './system.controller'

@Module({
  imports: [TypeOrmModule.forFeature([System])],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
