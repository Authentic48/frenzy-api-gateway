import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  userUUID: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  isPhoneVerified: boolean;
}
