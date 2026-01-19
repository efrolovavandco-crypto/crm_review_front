import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';

import { environment } from '../environment/environment';
import { User } from '../_interface/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user = this.userSubject.asObservable();
  constructor(
    private router: Router,
    private http: HttpClient,

  ) {
    const userJson =localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<User | null>(userJson ? JSON.parse(userJson) : null);
    this.user = this.userSubject.asObservable();// будет ловить изсенения
  }
  setUser(user: User) {
    this.userSubject.next(user);
  }

  public get userValue(): User | null{
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/authenticate`, { username, password })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }


  updateUserLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }


  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['']);
  }
}
