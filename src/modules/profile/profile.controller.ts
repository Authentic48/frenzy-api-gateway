import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import {
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '../../libs/guards/auth.guard';
import { Profile, Profiles } from '../../libs/types/profile';
import { UserInfo } from '../../libs/decorators/user-info.decorator';
import { EProfileRouteTopics, IJWTPayload } from '@tintok/tintok-common';
import { CreateProfileDto } from './dtos/create.dto';
import { UpdateProfileDto } from './dtos/update.dto';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly rmq: RMQService) {}

  // TODO: Add request body
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'AccessToken',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: Boolean,
  })
  create(
    @UserInfo() { userUUID }: IJWTPayload,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.rmq.send<object, { isSuccessful: boolean }>(
      EProfileRouteTopics.CREATE,
      {
        ...createProfileDto,
        userUUID,
      },
    );
  }

  // TODO: Add request body
  @HttpCode(HttpStatus.CREATED)
  @Patch()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'AccessToken',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful',
    type: Boolean,
  })
  update(
    @UserInfo() { userUUID }: IJWTPayload,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.rmq.send<object, { isSuccessful: boolean }>(
      EProfileRouteTopics.UPDATE,
      {
        ...updateProfileDto,
        userUUID,
      },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('my')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'AccessToken',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: Profile,
  })
  getProfileByUserUUID(@UserInfo() { userUUID }: IJWTPayload) {
    return this.rmq.send<{ userUUID: string }, object>(
      EProfileRouteTopics.GET_PROFILE_BY_USER_UUID_OR_UUID,
      { userUUID },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'AccessToken',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: Profile,
  })
  getProfileByUUID(@Param('id', ParseUUIDPipe) uuid: string) {
    return this.rmq.send<{ uuid: string }, object>(
      EProfileRouteTopics.GET_PROFILE_BY_USER_UUID_OR_UUID,
      { uuid },
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @UseGuards(AuthGuard)
  @ApiHeader({
    name: 'AccessToken',
  })
  @ApiUnauthorizedResponse({
    description: 'UnAuthorized',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: Profiles,
    isArray: true,
  })
  async getProfiles(@UserInfo() { userUUID }: IJWTPayload) {
    return this.rmq.send<string, object>(
      EProfileRouteTopics.GET_PROFILES,
      userUUID,
    );
  }
}
