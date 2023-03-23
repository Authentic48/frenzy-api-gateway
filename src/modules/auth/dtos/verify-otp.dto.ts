import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  @Max(99999)
  otp: number;
}
