import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ExternalJwtService } from '../../modules/auth/jwt/external-jwt.service';
import { NextFunction, Request, Response } from 'express';
import { JwtTokenTypes } from '../utils/enum';

@Injectable()
export class VerifyOtpMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(VerifyOtpMiddleware.name);
  constructor(private readonly jwtService: ExternalJwtService) {}

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

      const jwtPayload = await this.jwtService.verifyToken(
        token,
        JwtTokenTypes.VERIFY_OTP_ACCESS_TOKEN,
      );

      req['isOtpTokenValid'] = true;
      req['userInfo'] = jwtPayload;
      return next();
    } catch (e) {
      this.logger.error(e);
      req['isOtpTokenValid'] = false;
      next();
    }
  }
}
