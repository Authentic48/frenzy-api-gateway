import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ExternalJwtService } from '../../modules/auth/jwt/external-jwt.service';
import { NextFunction, Request, Response } from 'express';
import { JwtTokenTypes } from '../utils/enum';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

@Injectable()
export class RefreshMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger(RefreshMiddleware.name);
  constructor(private readonly jwtService: ExternalJwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token: string = req.headers?.refreshtoken as string;

      if (!token) {
        req['isRequestTokenValid'] = false;
        return next();
      }

      const { isTokenValid, payload } = await this.jwtService.verifyToken(
        token,
        JwtTokenTypes.REFRESH_TOKEN,
      );

      if (!isTokenValid) {
        req['isRequestTokenValid'] = false;
        return next();
      }

      const refreshToken: IRefreshToken = { token };

      req['isRequestTokenValid'] = true;
      req['userInfo'] = payload;
      req['refreshToken'] = refreshToken;
      return next();
    } catch (e) {
      this.logger.error(e);
      req['isRequestTokenValid'] = false;
      return next();
    }
  }
}
