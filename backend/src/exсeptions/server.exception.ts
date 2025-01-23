import { HttpException } from '@nestjs/common';
import { ErrorCode, code2status } from './error.codes';

export class ServerException extends HttpException {
  constructor(code: ErrorCode, message: string) {
    const status = code2status.get(code);
    super(message, status);
  }
}
