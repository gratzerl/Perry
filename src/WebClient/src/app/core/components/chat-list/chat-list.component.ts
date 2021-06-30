import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatMessage } from '../../models/chat-message.model';
import { ChatMessageService } from '../../services/chat-message.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.less']
})
export class ChatListComponent implements OnInit, OnDestroy {

  messages : ChatMessage[] = [];
  private onDestroy = new Subject<void>();

  constructor(private chatService: ChatMessageService) { 
    this.chatService.getMessages$()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(m => { this.messages = m; });
  }

  ngOnInit(): void {
    this.messages = this.chatService.getMessages();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  
  getMessages() {
    const m = this.chatService.getMessages();
  }
}
