import { PermissionCrontrollerDto } from './permission-controller.dto'
import { IsString, ValidateNested } from 'class-validator'

export class UpdatePermissionDto {
  @IsString()
  name?: string

  @ValidateNested()
  controllers?: PermissionCrontrollerDto[]
}
