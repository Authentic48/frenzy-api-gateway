import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { VerifyOtpMiddleware } from '../../libs/middlewares/verify-otp.middleware';
import { ExternalJwtModule } from './jwt/external-jwt.module';

@Module({
  imports: [ExternalJwtModule],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyOtpMiddleware)
      .exclude({ path: 'auth/register', method: RequestMethod.POST })
      .forRoutes(AuthController);
  }
}
