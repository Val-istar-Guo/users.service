import { Controller, Get, Query, Param, Post, Body, Put, Delete, HttpException, HttpStatus } from '@nestjs/common'
import { RolesService } from './roles.service'
import { Role } from '@/entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Pagination } from '@/dto/pagination.dto'
import { RolesServiceFilter } from './dto/filter.dto'
import { Page } from '@/interface/page.interface'

@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  public async findAll(
    @Query() page: Pagination,
    @Query() filter: RolesServiceFilter,
  ): Promise<Page<Role>> {
    return await this.rolesService.findAll(page, filter)
  }

  @Get(':id')
  public async find(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.findOne(id)
  }

  @Post()
  public async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(createRoleDto)
  }

  @Put(':id')
  public async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return await this.rolesService.update(id, updateRoleDto)
  }

  @Delete(':id')
  public async delete(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.delete(id)
  }
}
