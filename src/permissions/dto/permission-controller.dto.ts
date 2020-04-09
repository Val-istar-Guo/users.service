import { PermissionController } from '../interfaces/permission-controller.interface'
import { IsString, IsNotEmpty } from 'class-validator'


export class PermissionCrontrollerDto implements PermissionController {
  @IsString()
  type!: string

  @IsNotEmpty()
  value: any
}
