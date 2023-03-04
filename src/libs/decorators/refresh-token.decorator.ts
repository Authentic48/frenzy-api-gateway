import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRefreshToken } from '../interfaces/refresh-token.interface';

export const RefreshToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): IRefreshToken => {
    const request = context.switchToHttp().getRequest();
    return request['refreshToken'];
  },
);
