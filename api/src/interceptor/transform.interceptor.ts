import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => ({
        // Nếu data có chứa message riêng thì lấy, không thì để default
        message: data?.message || 'Thao tác thành công',
        statusCode: statusCode,
        // Nếu data là object có field data bên trong (như pagination) thì bóc tách
        data: data?.data !== undefined ? data.data : data,
        // Có thể thêm meta cho phân trang nếu cần
        meta: data?.meta || undefined,
      })),
    );
  }
}
