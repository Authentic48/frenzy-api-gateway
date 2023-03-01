import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { AuthDto } from './dtos/auth.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { VerifyOtpGuard } from '../../libs/guards/verify-otp.guard';
import { UserInfo } from '../../libs/decorators/user-info.decorator';
import { IJWTPayload } from '../../libs/interfaces/payload.interface';
import { AuthRouteTopics } from '../../libs/utils/enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly rmq: RMQService) {}

  @Post('register')
  register(@Body() { phone }: AuthDto) {
    return this.rmq.send<string, { accessToken: string }>(
      AuthRouteTopics.REGISTER,
      phone,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  @UseGuards(VerifyOtpGuard)
  verifyOTTP(
    @Body() { otp }: VerifyOtpDto,
    @UserInfo() { userUUID }: IJWTPayload,
  ) {
    return this.rmq.send<
      { otp: number; userUUID: string },
      { accessToken: string; refreshToken: string }
    >(AuthRouteTopics.REGISTER_VERIFY_OTP, {
      otp,
      userUUID,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  @UseGuards(VerifyOtpGuard)
  reSendOTP(@UserInfo() { userUUID }: IJWTPayload) {
    return this.rmq.send<{ userUUID: string }, { success: boolean }>(
      AuthRouteTopics.RE_SEND_OTP,
      {
        userUUID,
      },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() { phone }: AuthDto) {
    return this.rmq.send<string, { accessToken: string }>(
      AuthRouteTopics.LOGIN,
      phone,
    );
  }
}
