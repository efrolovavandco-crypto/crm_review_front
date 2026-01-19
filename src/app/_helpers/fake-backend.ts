import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { Role } from '../_interface/role';

const users = [
  { id: 1, username: 'admin', password: 'admin', fullname: 'Admin', phone: 'User', role: Role.Admin, age: 'User', gender: 'User', position: 'User' },
  { id: 2, username: 'user', password: 'user', fullname: 'ФИО Юзер', phone: '8999999', role: Role.User, age: '19', gender: 'male', position: 'loader' }
];


let currentUserId = users.length ? Math.max(...users.map(u => u.id)) : 0;

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/user/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/user') && method === 'GET':
          return getUsers();
        case url.match(/\/user\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/user\/\d+$/) && method === 'DELETE':
          return deleteUser();
        case url.endsWith('/user') && method === 'POST':
          return createUser();
        case url.match(/\/user\/\d+$/) && method === 'PUT':
          return updateUser();


        case url.endsWith('/user/change-password') && method === 'POST':
          return changePassword();

        default:
          return next.handle(request);
      }
    }
    function changePassword() {
      const { userId, password } = body;

      const user = users.find(u => u.id === userId);
      if (!user) return error('User not found');

      user.password = password;

      return ok('ok');
    }


    function getUsers() {
      return ok(users.filter(u => u.role !== Role.Admin));
    }

    function createUser() {
      currentUserId++;
      const newUser = {
        id: currentUserId,
        username: `user${currentUserId}`,
        password: `pass${currentUserId}`,
        fullname: body.fullname || '',
        phone: body.phone || '',
        age: body.age || '',
        gender: body.gender || '',
        position: body.position || '',
        role: body.role || Role.User
      };
      users.push(newUser);
      return ok(newUser);
    }

    function updateUser() {
      const id = idFromUrl();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return error('не найден пользователь');
      users[index] = { ...users[index], ...body };
      return ok(users[index]);
    }


    function deleteUser() {
      const id = idFromUrl();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return error('не найден пользователь');
      users.splice(index, 1);
      return ok({});
    }

    function getUserById() {
      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }

    function authenticate() {
      const { username, password } = body;
      const user = users.find(x => x.username === username && x.password === password);
      if (!user) return error('');
      return ok({
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        position: user.position,
        role: user.role,
        token: `fake-jwt-token.${user.id}`
      });
    }

    function ok(body: any) {
      return of(new HttpResponse({ status: 200, body })).pipe(delay(200));
    }

    function error(message: string) {
      return throwError({ status: 400, error: { message } }).pipe(materialize(), delay(200), dematerialize());
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }

  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
