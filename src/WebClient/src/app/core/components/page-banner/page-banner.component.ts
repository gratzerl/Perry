import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointQuery } from '../../constants/general.constants';

@Component({
  selector: 'app-page-banner',
  templateUrl: './page-banner.component.html',
  styleUrls: ['./page-banner.component.less']
})
export class PageBannerComponent implements OnInit, OnDestroy {

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

}
