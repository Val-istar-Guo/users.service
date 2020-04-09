import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import { AuthorizationPayload } from './interfaces/authorization-payload'
import { UsersService } from './users.service'
import { jwtSecret } from '@/env'

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authorization: string = request.get('Authorization')

    if (!authorization) return false
    const payload = jwt.verify(authorization.slice('Bearer '.length), jwtSecret) as AuthorizationPayload
    request.user = await this.usersService.findOne(payload.userId)

    return true
  }
}
