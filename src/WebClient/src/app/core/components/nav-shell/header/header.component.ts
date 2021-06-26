import { Component, ViewChild } from '@angular/core';
import { ChatDrawerComponent } from '../../chat-drawer/chat-drawer.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {
  @ViewChild(ChatDrawerComponent) child : ChatDrawerComponent | undefined;

  constructor() { }

  toggleChatDrawer() {
    if (this.child != undefined) {
      this.child.toggleDrawer();
    }
  }
}
