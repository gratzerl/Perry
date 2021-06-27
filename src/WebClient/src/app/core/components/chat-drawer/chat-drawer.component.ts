import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointQuery } from '../../constants/general.constants';
import { ChatMessage } from '../../models/chat-message.model';
import { ChatMessageService } from '../../services/chat-message.service';
import { QnAMakerService } from '../../services/qna-maker.service';

@Component({
  selector: 'app-chat-drawer',
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.less']
})
export class ChatDrawerComponent implements OnInit {
  @ViewChild('messageInput') messageInput !: ElementRef; 

  @Output() isClosed = new EventEmitter<boolean>();
  @Input() isOpen: boolean = false;
  
  isXsScreen = false;

  private onDestroy = new Subject<void>();
  
  constructor(
    private breakpointObserver: BreakpointObserver, 
    private chatService: ChatMessageService,
    private qnaService: QnAMakerService) { }

  ngOnInit(): void {
    this.breakpointObserver.observe(BreakpointQuery.Xs)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(state => this.isXsScreen = state.matches);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  close() {
    this.isOpen = false;
    this.isClosed.emit(true);
  }

  open() {
    this.isOpen = true;
    this.isClosed.emit(false);
  }

  sendQuestion(message: string): void {
    if (message.length == 0) {
      return;
    }

    const chatMessage: ChatMessage = new ChatMessage(message, true);
    this.chatService.addMessage(chatMessage);
    this.messageInput.nativeElement.value = ' ';

    this.qnaService.loadAnswer(chatMessage);
  }

  ClearMessages(): void {
    this.chatService.clearMessages();
  }
}
