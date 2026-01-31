import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1), // Повторить запрос 1 раз при ошибке
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
          // Клиентская ошибка
          errorMessage = `Ошибка: ${error.error.message}`;
        } else {
          // Серверная ошибка
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = `Код ошибки: ${error.status}\nСообщение: ${error.message}`;
          }
        }

        console.error('HTTP Error:', errorMessage);
        return throwError(() => error);
      })
    );
  }
}
