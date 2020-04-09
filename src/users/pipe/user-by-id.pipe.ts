import { Injectable, PipeTransform } from '@nestjs/common'
import { UsersService } from '@/users/users.service'
import { User } from '@/entity'

@Injectable()
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly usersService: UsersService) {}
  async transform(id: number): Promise<User> {
    return this.usersService.findOne(id)
  }
}
