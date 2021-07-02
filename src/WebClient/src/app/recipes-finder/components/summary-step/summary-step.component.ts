import { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PreferenceCategory } from '../../constants';
import { SelectionItem } from '../../models';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-summary-step',
  templateUrl: './summary-step.component.html',
  styleUrls: ['./summary-step.component.less']
})
export class SummaryStepComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  preferenceCategory = PreferenceCategory;
  hasSelectedPreferences = false;

  ingredients: SelectionItem<string>[] = [];

  constructor(public stepperService: RecipeStepperService, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.stepperService.data$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.ingredients = [...data.additionalIngredients]
          .map(i => {
            i.item = this.translocoService.translate(i.label ?? i.item);
            return i;
          });

        if (data.identifiedIngredients !== undefined) {
          this.ingredients = this.ingredients.concat(data.identifiedIngredients);
        }

        this.hasSelectedPreferences = data.arePreferencesSelected();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
