import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  @Max(99999)
  otp: number;
}
