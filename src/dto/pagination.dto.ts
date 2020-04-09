import { IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class Pagination {
  @IsNumber({ allowNaN: false }, { message: '必须设置 offset' })
  @Transform((id: string) => parseInt(id))
  offset!: number

  @IsNumber({ allowNaN: false }, { message: '必须设置 limit' })
  @Transform((id: string) => parseInt(id))
  limit!: number
}
