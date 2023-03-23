import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  getVerifyOTPAccessTokenKey(userUUID: string) {
    return `verify-otp-access-token-${userUUID}`;
  }

  async exists(tokenUUID: string) {
    const result = await this.redis.exists(
      this.getVerifyOTPAccessTokenKey(tokenUUID),
    );
    return !!result;
  }
}
