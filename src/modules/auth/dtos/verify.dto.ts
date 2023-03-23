import { ApiProperty } from '@nestjs/swagger';

export class Verify {
  @ApiProperty()
  verifyOTPToken: string;
}
