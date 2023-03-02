import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ExternalJwtService } from '../../modules/auth/jwt/external-jwt.service';
import { NextFunction, Request, Response } from 'express';
import { AuthRouteTopics, JwtTokenTypes } from '../utils/enum';
import { RMQService } from 'nestjs-rmq';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(AuthMiddleware.name);
  constructor(
    private readonly jwtService: ExternalJwtService,
    private readonly rmq: RMQService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization: string = req.headers.authorization;

      if (!authorization) {
        req['isUserAuthenticated'] = false;
        return next();
      }

      const bearer: string[] = authorization.split(' ');

      if (!bearer || bearer.length < 2) {
        req['isUserAuthenticated'] = false;
        return next();
      }

      const token: string = bearer[1];

      const { isTokenValid, payload } = await this.jwtService.verifyToken(
        token,
        JwtTokenTypes.ACCESS_TOKEN,
      );

      if (!isTokenValid) {
        req['isUserAuthenticated'] = false;
        return next();
      }

      const { deviceUUID, userUUID, accessTokenUUID } = payload;

      const { success } = await this.rmq.send<
        { deviceUUID: string; userUUID: string; accessTokenUUID: string },
        Record<string, boolean>
      >(AuthRouteTopics.VERIFY_SESSION, {
        accessTokenUUID,
        deviceUUID,
        userUUID,
      });

      if (!success) {
        req['isUserAuthenticated'] = false;
        return next();
      }

      req['isUserAuthenticated'] = true;
      req['userInfo'] = payload;
      return next();
    } catch (e) {
      this.logger.error(e);
      req['isUserAuthenticated'] = false;
      next();
    }
  }
}
