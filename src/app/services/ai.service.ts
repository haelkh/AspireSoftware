import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private parseApiUrl =
    'http://localhost/eventScheduler/api/ai/parse-event-text.php';
  private summarizeApiUrl =
    'http://localhost/eventScheduler/api/ai/summarize-description.php';

  constructor(private http: HttpClient) {}

  parseEventText(text: string): Observable<Partial<Event>> {
    return this.http.post<Partial<Event>>(this.parseApiUrl, { text });
  }

  summarizeDescription(text: string): Observable<{ summary: string }> {
    return this.http.post<{ summary: string }>(this.summarizeApiUrl, { text });
  }
}
