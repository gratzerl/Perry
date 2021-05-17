import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoutedStep, RoutedStepStatus } from '../../models';
import { RecipeStepperService } from '../../services';
import { BreakpointQuery } from 'src/app/core/constants/general.constants';

@Component({
  selector: 'app-recipe-suggestion-stepper',
  templateUrl: './recipe-suggestion-stepper.component.html',
  styleUrls: ['./recipe-suggestion-stepper.component.scss']
})
export class RecipeSuggestionStepperComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  isSmallScreen = false;
  stepStatus = RoutedStepStatus;
  currentStep?: RoutedStep;

  constructor(public stepperService: RecipeStepperService, private router: Router, private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe(BreakpointQuery.Sm)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(state => this.isSmallScreen = state.matches);

    this.stepperService.currentStep$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(step => {
        this.router.navigate([step.route], { relativeTo: this.route });
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  completeStepper(): void {
    this.stepperService.complete();
  }
}
