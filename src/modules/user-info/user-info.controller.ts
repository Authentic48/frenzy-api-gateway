import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { AuthGuard } from '../../libs/guards/auth.guard';
import { UserInfo } from '../../libs/decorators/user-info.decorator';
import { IJWTPayload } from '../../libs/interfaces/payload.interface';
import { AuthRouteTopics } from '../../libs/utils/enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users - Users Information')
@Controller('user-info')
export class UserInfoController {
  constructor(private readonly rmq: RMQService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthGuard)
  async getUserInfo(@UserInfo() { userUUID }: IJWTPayload) {
    return this.rmq.send<
      string,
      {
        userUUID: string;
        roles: string[];
        status: string;
        isPhoneVerified: boolean;
      }
    >(AuthRouteTopics.GET_USER_INFO, userUUID);
  }
}
