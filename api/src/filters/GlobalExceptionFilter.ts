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

     if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      const message = 
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? exceptionResponse.message  // Lấy message custom từ exception
          : exception.message;

      return response.status(exception.getStatus()).send({
        statusCode: exception.getStatus(),
        message: message,  // ← Giờ sẽ là "Thông tin đăng nhập không chính xác"
      });
    }
    return response.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
}