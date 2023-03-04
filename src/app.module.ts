import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './configs/config.schema';
import { getRMQConfig } from './configs/rmq.config';
import { RMQModule } from 'nestjs-rmq';
import { AuthModule } from './modules/auth/auth.module';
import { VerifyOtpMiddleware } from './libs/middlewares/verify-otp.middleware';
import { ExternalJwtModule } from './modules/auth/jwt/external-jwt.module';
import { AuthMiddleware } from './libs/middlewares/auth.middleware';
import { RefreshMiddleware } from './libs/middlewares/refresh.middleware';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
    ExternalJwtModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyOtpMiddleware, AuthMiddleware, RefreshMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
