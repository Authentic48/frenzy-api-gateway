import { Module } from '@nestjs/common';
import { ExternalJwtService } from './external-jwt.service';
import { getJwtConfig } from '../../../configs/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.registerAsync(getJwtConfig())],
  providers: [ExternalJwtService],
  exports: [ExternalJwtService],
})
export class ExternalJwtModule {}
