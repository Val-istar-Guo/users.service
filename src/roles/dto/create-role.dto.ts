import { IsString, IsNumber } from 'class-validator'

export class CreateRoleDto {
  @IsString()
  name!: string

  @IsNumber()
  systemId!: number
}
