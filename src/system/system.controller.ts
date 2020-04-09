import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common'
import { SystemService } from './system.service'
import { System } from '@/entity'
import { CreateSystemDto } from './dto/create-system.dto'
import { UpdateSystemDto } from './dto/update-system.dto'
import { Page } from '@/interface/page.interface'
import { Pagination } from '@/dto/pagination.dto'
import { SystemServiceFilter } from './dto/filter.dto'

@Controller('system')
export class SystemController {
  constructor(private systemService: SystemService) {}

  @Get()
  public async findAll(
    @Query() page: Pagination,
    @Query() filter: SystemServiceFilter,
  ): Promise<Page<System>> {
    return this.systemService.findAll(page, filter)
  }

  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<System> {
    return this.systemService.findOne(id)
  }

  @Post()
  public async create(@Body() createSystemDto: CreateSystemDto): Promise<System> {
    return this.systemService.create(createSystemDto)
  }

  @Put(':id')
  public async update(@Query('id') id: number, @Body() updateSystemDto: UpdateSystemDto): Promise<System> {
    return this.systemService.update(id, updateSystemDto)
  }

  @Delete(':id')
  public async delete(@Query('id') id: number): Promise<System> {
    return this.systemService.delete(id)
  }
}
