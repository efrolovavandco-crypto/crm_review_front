import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';
import { AuthenticationService } from '../_services/authentication-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Не добавлять токен на логин
    if (!req.url.endsWith('/authenticate')) {
      const user = this.authenticationService.userValue;
      if (user && user.token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.token}`
          }
        });
      }
    }
    return next.handle(req);
  }


}
