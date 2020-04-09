import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { User } from "@/entity";
import { Reflector } from "@nestjs/core";
import { PermissionsService } from "./permissions.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user: User = request.user
    const permissions = this.reflector.get<string[]>('permissions', context.getHandler())
    if (!permissions) return true

    console.log(user, permissions)
    // const systemId = getUserSystemId()
    // this.permissionsService.findAll(0, permissions.length, { userId: user.id, systemId })

    return true
  }
}
