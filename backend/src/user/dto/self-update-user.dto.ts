import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class SelfUpdateUserDto {
  @ApiPropertyOptional({ description: 'Avatar image URL' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  linkAvatar?: string | null;

  @ApiPropertyOptional({ description: 'Personal phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^[0-9+-\s]*$/, {
    message: 'Số điện thoại chỉ được chứa các chữ số, khoảng trắng hoặc ký tự + -',
  })
  phone?: string | null;

  @ApiPropertyOptional({ description: 'Personal address' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string | null;

  @ApiPropertyOptional({ description: 'Emergency contact info' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  emergencyContact?: string | null;

  @ApiPropertyOptional({ description: 'Birthday' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthday?: Date | null;

  @ApiPropertyOptional({ description: 'New password' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  password?: string;

  @ApiPropertyOptional({ description: 'Old password' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  oldPassword?: string;
}
