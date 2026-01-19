// app/_services/export-service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  exportUsersToPdf(columns: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/users-pdf`, { columns }, { responseType: 'blob' });
  }

  exportUsersToHtml(columns: string[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/export/users-html`, { columns }, { responseType: 'blob' });
  }

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
