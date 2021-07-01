import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointQuery } from '../../constants/general.constants';
import { ChatMessageService, QnAMakerService } from '../../services';
import { ChatMessage } from '../../models';

@Component({
  selector: 'app-chat-drawer',
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.less']
})
export class ChatDrawerComponent implements OnInit, OnDestroy {

  @ViewChild('messageInput')
  messageInput !: ElementRef;

  @Output()
  isClosed = new EventEmitter<boolean>();

  @Input()
  isOpen = false;

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
    if (message.trim().length == 0) {
      return;
    }

    const chatMessage: ChatMessage = new ChatMessage(message, true);
    this.chatService.addMessage(chatMessage);
    this.messageInput.nativeElement.value = ' ';

    this.qnaService.loadAnswer(chatMessage);
  }

  clearMessages(): void {
    this.chatService.clearMessages();
  }

  getWidth(): number {
    console.log('getwidth');
    return this.isXsScreen ? window.innerWidth : 400;
  }
}
