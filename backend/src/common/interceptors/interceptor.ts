import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode || 200;

        if (
          data &&
          typeof data === "object" &&
          "message" in data &&
          "data" in data
        ) {
          return {
            statusCode,
            message: data.message,
            data: data.data,
          };
        }

        return {
          statusCode,
          message: "Success",
          data: data ?? {},
        };
      }),
    );
  }
}
