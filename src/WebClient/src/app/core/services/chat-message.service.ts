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
    console.log(messagesJson);
    let messages: ChatMessage[] = [];
    if (messagesJson == undefined || messagesJson.length == 0) {
      messages.push(new ChatMessage(this.transloco.translate('how-to.information'), false));
      return messages;
    } 
    
    return JSON.parse(messagesJson);
  }

  public clearMessages() {
    sessionStorage.removeItem(this.messagesKey);
    
    let initArray = new Array<ChatMessage>();
    initArray.push(new ChatMessage(this.transloco.translate('how-to.information'), false));
    this.messages$.next(initArray);
  }

  public getMessagesObservable() : Observable<ChatMessage[]> {
    return this.messages$.asObservable();
  }
}
