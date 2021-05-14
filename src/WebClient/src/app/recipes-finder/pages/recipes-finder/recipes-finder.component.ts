import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { pluck, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recipes-finder',
  templateUrl: './recipes-finder.component.html',
  styleUrls: ['./recipes-finder.component.scss']
})
export class RecipesFinderComponent implements OnInit, OnDestroy {

  private onDestroy = new Subject<void>();
  steps: MenuItem[] = [];

  constructor(private transloco: TranslocoService) { }

  ngOnInit(): void {
    this.transloco.events$
      .pipe(takeUntil(this.onDestroy), pluck('payload'))
      .subscribe(() => {
        this.steps = this.createStepItems();
      });

    this.transloco.langChanges$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.steps = this.createStepItems();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private createStepItems(): MenuItem[] {
    return [
      {
        label: this.transloco.translate('rf.ingredients.step-label'),
        routerLink: 'identification'
      },
      {
        label: this.transloco.translate('rf.preferences.step-label'),
        routerLink: 'preferences'
      },
    ];
  }

}
