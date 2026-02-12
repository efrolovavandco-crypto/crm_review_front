import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

export interface ExportRequest {
  columns: string[];
  format: 'PDF' | 'HTML';
  data?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  exportUsers(payload: ExportRequest): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/export`,
      payload,
      { responseType: 'blob' }
    );
  }
}
