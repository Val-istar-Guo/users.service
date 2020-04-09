import { IsString } from 'class-validator'

export class CreateSystemDto {
  @IsString()
  name!: string
}
