import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { AuthGuard } from '../../libs/guards/auth.guard';
import {
  EAuthRouteTopics,
  IJWTPayload,
  IUserInfo,
} from '@tintok/tintok-common';
import {
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../libs/types/user';
import { UserInfo } from '../../libs/decorators/user-info.decorator';

@ApiTags('Users - Users Information')
@Controller('user-info')
export class UserInfoController {
  constructor(private readonly rmq: RMQService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'Access Token',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: User,
  })
  async getUserInfo(@UserInfo() { userUUID }: IJWTPayload) {
    return this.rmq.send<string, IUserInfo>(
      EAuthRouteTopics.GET_USER_INFO,
      userUUID,
    );
  }
}
