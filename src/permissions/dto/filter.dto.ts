import { IsOptional, IsNumber, ArrayMinSize } from "class-validator"
import { Transform } from "class-transformer"

export class PermissionsServiceFilter {
  @IsOptional()
  @IsNumber(undefined, { each: true })
  @ArrayMinSize(1)
  @Transform((ids: string) => ids ? ids.split(',').map(id => Number(id)) : undefined)
  userIds?: number[]

  @IsOptional()
  @IsNumber(undefined, { each: true })
  @ArrayMinSize(1)
  @Transform((ids: string) => ids ? ids.split(',').map(id => Number(id)) : undefined)
  systemIds?: number[]

  @IsOptional()
  @IsNumber(undefined, { each: true })
  @ArrayMinSize(1)
  @Transform((ids: string) => ids ? ids.split(',').map(id => Number(id)) : undefined)
  roleIds?: number[]
}
