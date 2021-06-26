import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointQuery } from '../../constants/general.constants';

@Component({
  selector: 'app-chat-drawer',
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.less']
})
export class ChatDrawerComponent implements OnInit {
  public isOpen: boolean = false;
  private onDestroy = new Subject<void>();

  isXsScreen = false;
  
  constructor(private breakpointObserver: BreakpointObserver) { }

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
  }

  public toggleDrawer() {
    this.isOpen = !this.isOpen;
  }  
}
