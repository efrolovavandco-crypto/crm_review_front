import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_interface/user';
import { tap } from 'rxjs/operators';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUsers();
  }
  private loadUsers() {
    this.http.get<User[]>('/user').subscribe(users => this.usersSubject.next(users));
  }
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/user`).pipe(
      tap(users=>this.usersSubject.next(users))
    );
  }
  create(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/user`, user).pipe(
      tap(newUser => {
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([newUser,...currentUsers]);
      })
    );
  }
  update(user: User): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/user/${user.id}`, user).pipe(
      tap(updatedUser => {
        const users = this.usersSubject.value.map(u => u.id === updatedUser.id ? updatedUser : u);
        this.usersSubject.next(users);
      })
    );
  }
  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/user/${id}`).pipe(
      tap(() => {
        const users = this.usersSubject.value.filter(u => u.id !== id);
        this.usersSubject.next(users);
      })
    );
  }
  changePassword(userId: number, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${environment.apiUrl}/user/change-password`,
      { userId, password }
    );
  }

}
