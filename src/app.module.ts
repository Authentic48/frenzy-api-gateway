import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './configs/config.schema';
import { getRMQConfig } from './configs/rmq.config';
import { RMQModule } from 'nestjs-rmq';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    RMQModule.forRootAsync(getRMQConfig()),
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
