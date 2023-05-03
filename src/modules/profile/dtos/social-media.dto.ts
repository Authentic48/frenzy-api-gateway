import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ESocialMedia {
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  TIKTOK = 'TIKTOK',
  INSTAGRAM = 'INSTAGRAM',
  SNAPCHAT = 'SNAPCHAT',
}
export class SocialMediaDto {
  @IsNotEmpty()
  @IsEnum(ESocialMedia)
  name: ESocialMedia;

  @IsNotEmpty()
  @IsString()
  username: string;
}
