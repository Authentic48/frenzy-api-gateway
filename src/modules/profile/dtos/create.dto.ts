import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EGender } from '../../../libs/enums/enum';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  height: string;

  @IsOptional()
  @IsEnum(EGender)
  gender: EGender;

  @IsOptional()
  @IsArray()
  interests: string[];

  @IsOptional()
  @IsArray()
  photos: string[];

  @IsOptional()
  @IsArray()
  languages: string[];
}
