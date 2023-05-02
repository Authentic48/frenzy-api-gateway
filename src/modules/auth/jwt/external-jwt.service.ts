import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenTypes, IJWTPayload } from '@tintok/tintok-common';

@Injectable()
export class ExternalJwtService {
  constructor(private readonly jwt: JwtService) {}

  async verifyToken(
    token: string,
    type: JwtTokenTypes,
  ): Promise<{ payload?: IJWTPayload; isTokenValid: boolean }> {
    let payload: IJWTPayload;

    payload = await this.jwt.verifyAsync<IJWTPayload>(token, {
      ignoreExpiration: false,
    });

    if (!payload || payload.type !== type) {
      return { isTokenValid: false };
    }

    return { payload, isTokenValid: true };
  }
}
