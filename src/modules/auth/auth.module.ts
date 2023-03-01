import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ExternalJwtModule } from './jwt/external-jwt.module';

@Module({
  imports: [ExternalJwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
