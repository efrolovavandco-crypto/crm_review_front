import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";

import { environment } from "../environment/environment";
import {Poll, PollRequest, PollResponse, UserPollProgress} from "../_interface/polls";

@Injectable({
  providedIn: 'root'
})
export class PollsService {
  private apiUrl = environment.apiUrl;
  private pollsSubject = new BehaviorSubject<Poll[]>([]);
  public polls$ = this.pollsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPolls();
  }

  private loadPolls(): void {
    this.getAll().subscribe({
      next: (polls) => this.pollsSubject.next(polls),
      error: (error) => console.error(error)
    });
  }

  getAll(): Observable<Poll[]> {
    return this.http.get<Poll[]>(`${this.apiUrl}/polls`).pipe(
      tap(polls => console.log('Polls loaded:', polls))
    );
  }

  getById(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiUrl}/polls/${id}`);
  }

  create(pollData: PollRequest): Observable<Poll> {
    return this.http.post<Poll>(`${this.apiUrl}/polls`, pollData).pipe(
      tap(newPoll => {
        const currentPolls = this.pollsSubject.value;
        const duplicate = currentPolls.some(c=>c.id===newPoll.id)
        if (!duplicate) {
          this.pollsSubject.next([...currentPolls, newPoll]);
        }
      })
    );
  }


  // В PollsService
  update(id: number, poll: Poll): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/polls/${id}`, poll).pipe(
      tap(() => this.loadPolls())
    );
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/polls/${id}`).pipe(
      tap(() => {
        const currentPolls = this.pollsSubject.value;
        const filteredPolls = currentPolls.filter(p => p.id !== id);
        this.pollsSubject.next(filteredPolls);
      })
    );
  }


  //гет статистика добавить после бэка!!
  getStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/polls/${id}/stats`);
  }
  resetStat(pollId: number, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/polls/${pollId}/responses/${userId}`);
  }



  resetPollResponses(pollId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/polls/${pollId}/responses`
    );
  }
  submitPollResponse(response: PollResponse): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/polls/${response.pollId}/responses`,
      response
    );
  }
  //Подтянуть связанные данные из таблицы response
  getUserPollProgress(): Observable<UserPollProgress[]> {
    return this.http.get<UserPollProgress[]>(`${this.apiUrl}/polls/user/progress`);
  }

  // Получить прогресс конкретного пользователя для конкретного опроса
  getUserPollProgressForPoll(userId: number, pollId: number): Observable<UserPollProgress> {
    return this.http.get<UserPollProgress>(
      `${this.apiUrl}/polls/${pollId}/user/${userId}/progress`
    );
  }

  // Проверить, может ли пользователь пройти опрос
  canUserTakePoll(pollId: number): Observable<{ canTake: boolean, reason?: string }> {
    return this.http.get<{ canTake: boolean, reason?: string }>(
      `${this.apiUrl}/polls/${pollId}/can-take`
    );
  }
  private transformPollToServerFormat(poll: Poll): any {

    return {
      title: poll.title,
      description: poll.description || null,
      is_active: poll.isActive ? "1" : "0",
      questions: poll.questions?.map((question, qIndex) => ({
        id: question.id || undefined,
        text: question.text,
        order: qIndex,
        answers: question.answers?.map((answer, aIndex) => ({
          id: answer.id || undefined,
          text: answer.text,
          is_correct: answer.isCorrect ? "1" : "0", //преобразование в инт
          order: aIndex
        })) || []
      })) || []
    };
  }

}
