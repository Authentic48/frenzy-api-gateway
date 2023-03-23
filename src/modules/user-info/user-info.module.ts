import { Module } from '@nestjs/common';
import { UserInfoController } from './user-info.controller';

@Module({
  controllers: [UserInfoController],
})
export class UserInfoModule {}
