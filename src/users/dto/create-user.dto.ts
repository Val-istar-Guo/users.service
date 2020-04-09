import { IsIn, IsString, IsEmail, IsPhoneNumber, IsUrl, IsNumber, IsOptional, MinLength, IsLowercase } from 'class-validator'
import {} from 'class-transformer'
import { countries } from 'countries-list'


export class CreateRootDto {
  @IsString({ message: '名称不能为空' })
  name!: string

  @IsString({ message: '昵称不能为空' })
  nickname!: string

  @IsString({ message: '请设置密码' })
  password!: string
}

export class CreateUserDto {
  @IsIn(Object.keys(countries))
  country!: string

  @IsString()
  @IsLowercase({ message: '字母必须小写' })
  @IsOptional()
  name?: string

  @IsString({ message: '昵称不能为空' })
  nickname!: string

  @IsString({ message: '请设置密码' })
  @MinLength(6, { message: '密码至少6位' })
  password!: string

  @IsUrl()
  @IsOptional()
  avatar?: string

  @IsEmail()
  email!: string

  @IsPhoneNumber('ZZ', { message: '请设置正确的手机号码' })
  phone!: string
}
