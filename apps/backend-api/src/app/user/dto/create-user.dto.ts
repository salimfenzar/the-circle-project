import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserGender, UserRole } from '../../../../../../libs/shared/src';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
