import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "Internal server error";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();

      message = exceptionResponse.message || exception.message;
      error = exceptionResponse.error || exception.name;
    } else {
      this.logger.error(exception);
    }
    if (status === HttpStatus.BAD_REQUEST && !Array.isArray(message)) {
      message = [message];
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: error,
    });
  }
}
