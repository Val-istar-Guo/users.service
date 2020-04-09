import { Controller, Get, Query, Param, Post, Put, Body, Delete } from '@nestjs/common'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permissions.dto'
import { Permission } from '@/entity'
import { UpdatePermissionDto } from './dto/update-permissions.dto'
import { Pagination } from '@/dto/pagination.dto'
import { PermissionsServiceFilter } from './dto/filter.dto'
import { Page } from '@/interface/page.interface'

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get()
  public async findAll(
    @Query() page: Pagination,
    @Query() filter: PermissionsServiceFilter,
  ): Promise<Page<Permission>> {
    return await this.permissionsService.findAll(page, filter)
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<Permission> {
    return await this.permissionsService.findOne(id)
  }

  @Post()
  public async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(createPermissionDto)
  }

  @Put(':id')
  public async update(@Param('id') id: number, @Body() updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    return this.permissionsService.update(id, updatePermissionDto)
  }

  @Delete(':id')
  public async delete(@Param('id') id: number): Promise<Permission> {
    return this.permissionsService.delete(id)
  }
}
