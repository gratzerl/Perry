import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private readonly messagesKey: string = 'howTo-messages';

  private messages$: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>(new Array<ChatMessage>());

  constructor() { }

  public addMessage(message: ChatMessage): void {
    let currentMessages = this.getMessages();
    currentMessages.push(message);    
    sessionStorage.setItem(this.messagesKey, JSON.stringify(currentMessages));

    this.messages$.next(this.getMessages());
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

  public getMessagesObservable() : Observable<ChatMessage[]> {
    return this.messages$.asObservable();
  }
}
