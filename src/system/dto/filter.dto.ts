import { IsString, IsOptional } from "class-validator"

export class SystemServiceFilter {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  title?: string
}
