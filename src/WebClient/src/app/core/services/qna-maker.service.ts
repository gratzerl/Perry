import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from 'src/app/shared/shared.module';
import { AppConfig, ChatMessage } from 'src/app/core/models';
import { ChatMessageService } from './chat-message.service';

@Injectable({
  providedIn: 'root'
})
export class QnAMakerService {
  private readonly route: string = `${this.config.apiBaseUrl}/query-answer`;

  constructor(@Inject(APP_CONFIG) private config: AppConfig,
    private http: HttpClient,
    private chatService: ChatMessageService) { }

  returnObservable(): Observable<string> {
    return this.http.get(this.route, { responseType: 'text' });
  }

  private queryAnswer(question: string): Observable<string> {
    let params = new HttpParams();
    params = params.append('question', question);

    let result = this.http.get(this.route, { params: params, responseType: 'text' });
    return result;
  }

  public loadAnswer(question: ChatMessage): void {
    this.queryAnswer(question.message)
      .subscribe(
        result => {
          const message = new ChatMessage(result, false);
          this.chatService.addMessage(message);
        },
        error => {
          const message = new ChatMessage("Something went wrong. Please try again later.", false);
          this.chatService.addMessage(message);
        });
  }
}
