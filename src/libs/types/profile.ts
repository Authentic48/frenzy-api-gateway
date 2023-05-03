import { EGender, ESocialMedia } from '../enums/enum';
import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty()
  name: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  age: number;

  @ApiProperty()
  height: string;

  @ApiProperty()
  gender: EGender;

  @ApiProperty()
  interests: string[];

  @ApiProperty()
  photos: string[];

  @ApiProperty()
  languages: string[];

  @ApiProperty()
  socialMedias: SocialMedia[];
}

export class SocialMedia {
  username: string;

  name: ESocialMedia;
}
