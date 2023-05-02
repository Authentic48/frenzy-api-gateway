import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ExternalJwtService } from '../../modules/auth/jwt/external-jwt.service';
import { NextFunction, Request, Response } from 'express';
import { JwtTokenTypes } from '@tintok/tintok-common';
import { RedisService } from '../services/redis.service';

@Injectable()
export class VerifyOtpMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(VerifyOtpMiddleware.name);
  constructor(
    private readonly jwtService: ExternalJwtService,
    private readonly redis: RedisService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization: string = req.headers.authorization;

      if (!authorization) {
        req['isOtpTokenValid'] = false;
        return next();
      }

      const bearer: string[] = authorization.split(' ');

      if (!bearer || bearer.length < 2) {
        req['isOtpTokenValid'] = false;
        return next();
      }

      const token: string = bearer[1];

      const { isTokenValid, payload } = await this.jwtService.verifyToken(
        token,
        JwtTokenTypes.VERIFY_OTP_ACCESS_TOKEN,
      );

      if (!isTokenValid) {
        req['isOtpTokenValid'] = false;
        return next();
      }

      const isOTPInDB = await this.redis.exists(payload.userUUID);

      if (!isOTPInDB) {
        req['isOtpTokenValid'] = false;
        return next();
      }

      req['isOtpTokenValid'] = true;
      req['userInfo'] = payload;

      return next();
    } catch (e) {
      this.logger.error(e);
      req['isOtpTokenValid'] = false;
      return next();
    }
  }
}
