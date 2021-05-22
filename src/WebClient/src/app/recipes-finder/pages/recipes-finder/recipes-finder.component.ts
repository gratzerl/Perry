import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecipeStepperData } from '../../models';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-recipes-finder',
  templateUrl: './recipes-finder.component.html',
  styleUrls: ['./recipes-finder.component.scss']
})
export class RecipesFinderComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  stepperCompleted = false;
  isLoading = false;

  recipeData?: RecipeStepperData;

  constructor(private stepperService: RecipeStepperService) { }

  ngOnInit(): void {
    this.stepperService.stepperComplete$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.recipeData = data;
        this.stepperCompleted = true;
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
