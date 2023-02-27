import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJWTPayload } from '../interfaces/payload.interface';

export const UserInfo = createParamDecorator(
  (_: undefined, context: ExecutionContext): IJWTPayload => {
    const request = context.switchToHttp().getRequest();
    return request['userInfo'];
  },
);
