import { ApiProperty } from '@nestjs/swagger';

export class Success {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
