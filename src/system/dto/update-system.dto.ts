import { IsString } from 'class-validator'

export class UpdateSystemDto {
  @IsString()
  name?: string

  @IsString()
  title?: string
}
