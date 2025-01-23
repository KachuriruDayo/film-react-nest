import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ServerException } from '../exсeptions/server.exception';

@Catch(ServerException)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.getResponse();
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    response.status(status).json({
      error: message,
    });
  }
}
