import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    // console.log("exception", exception);

    // Mongo duplicate key
    if (exception?.code === 11000) {
      const field = Object.keys(exception.keyPattern ?? {})[0];

      return response.status(HttpStatus.CONFLICT).send({
        statusCode: 409,
        message: `${exception.keyValue?.[field]} đã tồn tại`,
        field,
        value: exception.keyValue?.[field],
      });
    }

    // Nest HttpException
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).send({
        statusCode: exception.getStatus(),
        message: exception.message,
      });
    }

    return response.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
}