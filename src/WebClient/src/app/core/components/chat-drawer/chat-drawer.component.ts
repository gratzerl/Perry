import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-chat-drawer',
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.less']
})
export class ChatDrawerComponent implements OnInit {
  public isOpen: boolean = false;
  
  constructor() {
  }

  ngOnInit() {
  }

  close() {
    this.isOpen = false;
  }

  public toggleDrawer() {
    this.isOpen = !this.isOpen;
  }
  
}
