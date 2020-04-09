import { IsString, ValidateNested, IsNumber } from 'class-validator'
import { PermissionCrontrollerDto } from './permission-controller.dto'


export class CreatePermissionDto {
  @IsString()
  name!: string

  @IsNumber()
  systemId!: number

  @ValidateNested()
  crontrollers?: PermissionCrontrollerDto[]
}
