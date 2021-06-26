import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from 'src/app/core/core.module';
import { AppConfig } from 'src/app/core/models';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class QnAMakerService {
  private readonly route: string = `${this.config.apiBaseUrl}/query-answer`;
  private readonly messagesKey: string = 'howTo-messages';

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) { }

  public queryAnswer(question: string): void {
    const headers = new HttpHeaders().append('question', question);
    var result = this.http.get<string>(this.route, {headers}).subscribe(data => { console.log(data)}); 
    console.log(result);
  }

  public addMessage(message: ChatMessage): void {
    let currentMessages = this.getMessages();
    currentMessages.push(message);    
    sessionStorage.setItem(this.messagesKey, JSON.stringify(currentMessages));
  }

  public getMessages() : ChatMessage[] {
    const messagesJson = sessionStorage.getItem(this.messagesKey);

    let messages: ChatMessage[] = [];
    if (messagesJson == undefined) {
      return messages;
    } 
    
    return JSON.parse(messagesJson);
  }

  public clearMessages() {
    sessionStorage.removeItem(this.messagesKey);
  }
}
