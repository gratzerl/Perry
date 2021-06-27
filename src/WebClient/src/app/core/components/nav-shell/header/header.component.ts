import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {
  isOpen: boolean = false;

  constructor() { }

  toggleChatDrawer(isOpen: boolean) {
    this.isOpen = isOpen;
  }
}
