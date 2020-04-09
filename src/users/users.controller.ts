import { Controller, Get, Post, Query, Param, Body, Put, ParseIntPipe, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, HttpCode } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from '@/entity/user'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { LoginDto } from './dto/login.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { UserByIdPipe } from './pipe/user-by-id.pipe'
import { UserAuthGuard } from './user-auth.guard'
import { Pagination } from '@/dto/pagination.dto'
import { HasPermissions } from '@/permissions/decorator/permission.decorator'
import { LoggedInUser } from './decorator/logged-in-user.decorator'
import { Page } from '@/interface/page.interface'


@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async findAll(
    @Query() page: Pagination,
  ): Promise<Page<User>> {
    return this.usersService.findAll(page)
  }

  @Get('authorization')
  @UseGuards(UserAuthGuard)
  async auth(
    @LoggedInUser() user: User
  ): Promise<User> {
    return user
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe, UserByIdPipe) user: User
  ): Promise<User> {
    return user
  }


  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    return await this.usersService.create(createUserDto)
  }

  @Put(':id')
  @UseGuards(UserAuthGuard)
  @HasPermissions('update-personal-information', 'update-users-information')
  async update(
    @Param('id', ParseIntPipe, UserByIdPipe) user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return await this.usersService.update(user, updateUserDto)
  }


  @Delete(':id')
  @UseGuards(UserAuthGuard)
  async delete(
    @Param('id', ParseIntPipe, UserByIdPipe) user: User
  ): Promise<User> {
    return await this.usersService.delete(user)
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto
  ): Promise<{ token: string }> {
    return {
     token: await this.usersService.login(loginDto)
    }
  }

  @Put(':id/password')
  async updatePassword(
    @Param('id', ParseIntPipe, UserByIdPipe) user: User,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<User> {
    return await this.usersService.updatePassword(user, updatePasswordDto)
  }
}
