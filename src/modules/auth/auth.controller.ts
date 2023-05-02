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
import { AuthRouteTopics, IJWTPayload } from '@tintok/tintok-common';
import { AuthGuard } from '../../libs/guards/auth.guard';
import { RefreshGuard } from '../../libs/guards/refresh.guard';
import { RefreshToken } from '../../libs/decorators/refresh-token.decorator';
import { IRefreshToken } from '../../libs/interfaces/refresh-token.interface';
import {
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Verify } from './dtos/verify.dto';
import { Success } from './dtos/success.dto';

@ApiTags('Auth - User authentication, authorization, logout')
@Controller('auth')
export class AuthController {
  constructor(private readonly rmq: RMQService) {}

  @Post('register')
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: Verify,
  })
  register(@Body() { phone }: AuthDto) {
    return this.rmq.send<string, { verifyOTPToken: string }>(
      AuthRouteTopics.REGISTER,
      phone,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify')
  @UseGuards(VerifyOtpGuard)
  @ApiHeader({
    name: 'verify OTP Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
    type: Success,
  })
  verifyOTP(
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
  @ApiHeader({
    name: 'Verify OTP Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP resent successfully',
    type: Boolean,
  })
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
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: Verify,
  })
  login(@Body() { phone }: AuthDto) {
    return this.rmq.send<string, { accessToken: string }>(
      AuthRouteTopics.LOGIN,
      phone,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  logout(@UserInfo() { deviceUUID }: IJWTPayload) {
    return this.rmq.send<string, Record<string, boolean>>(
      AuthRouteTopics.LOGOUT,
      deviceUUID,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(RefreshGuard)
  @ApiHeader({
    name: 'Refresh Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'access refreshed successfully',
    type: Success,
  })
  refresh(
    @UserInfo() { userUUID, deviceUUID }: IJWTPayload,
    @RefreshToken() { token }: IRefreshToken,
  ) {
    return this.rmq.send<
      { userUUID: string; deviceUUID: string; refreshToken: string },
      { accessToken: string; refreshToken: string }
    >(AuthRouteTopics.REFRESH, {
      userUUID,
      deviceUUID,
      refreshToken: token,
    });
  }
}
