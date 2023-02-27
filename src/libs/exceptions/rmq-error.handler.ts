import { IRmqErrorHeaders, RMQError, RMQErrorHandler } from 'nestjs-rmq';
import { HttpException } from '@nestjs/common';

export class CustomRMQErrorHandler extends RMQErrorHandler {
  public static handle(headers: IRmqErrorHeaders): Error | RMQError {
    return new HttpException(
      {
        errors: headers['-x-error'],
        data: headers['-x-data'],
      },
      headers['-x-status-code'],
    );
  }
}
