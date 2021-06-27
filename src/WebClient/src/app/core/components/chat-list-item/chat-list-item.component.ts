import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.less']
})
export class ChatListItemComponent implements OnInit {
  @Input() message!: ChatMessage;
  tester:string = "well";
  isXsScreen = false;
    
  constructor() { }

  ngOnInit(): void {
  }
}
