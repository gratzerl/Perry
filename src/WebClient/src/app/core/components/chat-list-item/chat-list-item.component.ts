import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointQuery } from '../../constants/general.constants';

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.less']
})
export class ChatListItemComponent implements OnInit {

  isInputMessage: boolean = false;
  message!: string;
  dateTime!: string;

  isOpen: boolean = false;
  isXsScreen = false;

  private onDestroy = new Subject<void>();
    
  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe(BreakpointQuery.Xs)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(state => this.isXsScreen = state.matches);

      this.message = "well this will work or it wont, i really do no tknow but there is much to write and display anyway. so im jost asdfawse i want a tattoo but wher? back of neck? well not sure it fit and so it is seen always. mmh";
      this.dateTime = "2021-06-26 16:43";
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  getSender() : string {
    return this.isInputMessage ? 'You' : 'Botty McBotface';
  }
}
