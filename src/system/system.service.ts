import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { System } from '@/entity'
import { Repository, SelectQueryBuilder, QueryBuilder } from 'typeorm'
import { CreateSystemDto } from './dto/create-system.dto'
import { UpdateSystemDto } from './dto/update-system.dto'
import { SystemNotFoundException } from './exception/system-not-found.exception'
import { Page } from '@/interface/page.interface'
import { Pagination } from '@/dto/pagination.dto'
import { SystemServiceFilter } from './dto/filter.dto'


@Injectable()
export class SystemService {
  constructor(@InjectRepository(System) private systemRepository: Repository<System>) {}

  private setFilter<T>(queryBuilder: SelectQueryBuilder<T>, filter: SystemServiceFilter): void {
    if (filter.title) {
      queryBuilder
        .where('system.title = :title', filter)
    }

    if (filter.name) {
      queryBuilder
        .where('system.name = :name', filter)
    }
  }


  public async findAll(page: Pagination, filter: SystemServiceFilter): Promise<Page<System>> {
    const queryBuilder = this.systemRepository.createQueryBuilder('system')
      .take(page.limit)
      .skip(page.offset)

    this.setFilter(queryBuilder, filter)

    return {
      limit: page.limit,
      offset: page.offset,
      items: await queryBuilder.getMany(),
      total: await queryBuilder.getCount(),
    }
  }

  public async findOne(id: number): Promise<System> {
    const system = await this.systemRepository.findOne(id)
    if (!system) throw new SystemNotFoundException()

    return system
  }

  public async create(createSystemDto: CreateSystemDto): Promise<System> {
    const system = new System()
    system.name = createSystemDto.name
    return await this.systemRepository.save(system)
  }

  public async update(id: number, updateSystemDto: UpdateSystemDto): Promise<System> {
    const system = await this.systemRepository.findOne(id)
    if (!system) throw new SystemNotFoundException()

    if (updateSystemDto.name) system.name = updateSystemDto.name
    return await this.systemRepository.save(system)
  }

  public async delete(id: number): Promise<System> {
    const system = await this.systemRepository.findOne(id)
    if (!system) throw new SystemNotFoundException()

    return await this.systemRepository.remove(system)
  }
}
