import { HttpStatus } from '@nestjs/common';

export interface ErrorData {
  status: ErrorCode;
  message: string;
}

export enum ErrorCode {
  BadRequest = 101,
  ServerError = 102,
}

export const code2status = new Map<ErrorCode, HttpStatus>([
  [101, HttpStatus.BAD_REQUEST],
  [102, HttpStatus.INTERNAL_SERVER_ERROR],
]);
