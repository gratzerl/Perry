import { OnDestroy, OnInit } from '@angular/core';
import { Component, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PreferenceCategory } from '../../constants';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-summary-step',
  templateUrl: './summary-step.component.html',
  styleUrls: ['./summary-step.component.scss']
})
export class SummaryStepComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  preferenceCategory = PreferenceCategory;
  hasSelectedPreferences = false;

  constructor(public stepperService: RecipeStepperService) { }

  ngOnInit(): void {
    this.stepperService.data$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        const { preferences } = data;

        this.hasSelectedPreferences = Object.values(preferences).some(items => items.length > 0);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
