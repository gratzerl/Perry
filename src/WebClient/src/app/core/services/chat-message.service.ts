import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private readonly messagesKey: string = 'howTo-messages';

  private messages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>(new Array<ChatMessage>());

  constructor(private transloco: TranslocoService) {
    transloco.selectTranslation()
  }

  public addMessage(message: ChatMessage): void {
    let currentMessages = this.getMessages();
    currentMessages.push(message);    
    sessionStorage.setItem(this.messagesKey, JSON.stringify(currentMessages));

    this.messages$.next(this.getMessages());
  }

  public getMessages() : ChatMessage[] {
    const messagesJson = sessionStorage.getItem(this.messagesKey);

    if (messagesJson == undefined || messagesJson.length == 0) {
      return new Array<ChatMessage>();
    } 
    
    return JSON.parse(messagesJson);
  }

  public clearMessages() {
    sessionStorage.removeItem(this.messagesKey);
    this.addMessage(new ChatMessage(this.transloco.translate('how-to.information'), false));
  }

  public getMessagesObservable() : Observable<ChatMessage[]> {
    return this.messages$.asObservable();
  }
}
