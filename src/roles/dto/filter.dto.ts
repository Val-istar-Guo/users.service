import { IsOptional, IsNumber } from "class-validator"

export class RolesServiceFilter {
  @IsOptional()
  @IsNumber()
  systemId?: number

  @IsOptional()
  @IsNumber()
  userId?: number
}
