import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from '../../../libs/interfaces/payload.interface';
import { JwtTokenTypes } from '../../../libs/utils/enum';

@Injectable()
export class ExternalJwtService {
  constructor(private readonly jwt: JwtService) {}

  async verifyToken(token: string, type: JwtTokenTypes): Promise<IJWTPayload> {
    let payload: IJWTPayload;

    try {
      payload = await this.jwt.verify<IJWTPayload>(token, {
        ignoreExpiration: false,
      });
    } catch (e) {
      throw new UnauthorizedException('auth.invalid_token');
    }

    if (payload.type !== type) {
      throw new UnauthorizedException('auth.wrong_token_type');
    }

    return payload;
  }
}
