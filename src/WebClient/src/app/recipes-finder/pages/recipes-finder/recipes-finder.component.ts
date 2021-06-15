import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointQuery } from 'src/app/core/constants/general.constants';
import { RoutedStepStatus, RoutedStep } from '../../models';
import { RecipeStepperService, ROUTED_STEPS } from '../../services';

@Component({
  selector: 'app-recipes-finder',
  templateUrl: './recipes-finder.component.html',
  styleUrls: ['./recipes-finder.component.less']
})
export class RecipesFinderComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  isSmallScreen = false;
  isExtraSmallScreen = false;

  routedStepStatus = RoutedStepStatus;
  currentStepStatus: 'wait' | 'process' | 'error' | 'finish' = 'process';

  currentStep?: RoutedStep;
  currentStepIndex = 0;

  constructor(public stepperService: RecipeStepperService,
    private router: Router, private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.breakpointObserver.observe(BreakpointQuery.Sm)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(state => this.isSmallScreen = state.matches);

    this.breakpointObserver.observe(BreakpointQuery.Xs)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(state => this.isExtraSmallScreen = state.matches);

    this.stepperService.currentStep$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(step => {
        this.currentStepIndex = this.stepperService.steps.indexOf(step);
        this.router.navigate([step.route], { relativeTo: this.route });
      });

    this.stepperService.currentStepStatus$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(status => {
        switch (status) {
          case RoutedStepStatus.Loading:
            this.currentStepStatus = 'wait';
            break;
          case RoutedStepStatus.Invalid:
            this.currentStepStatus = 'error';
            break;
          default:
            this.currentStepStatus = 'process';
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  changeStep(stepIdx: number): void {
    const { currentStep } = this.stepperService;
    if (currentStep.isRequired && currentStep.status !== RoutedStepStatus.Valid) {
      return;
    }

    this.stepperService.goToStepIndex(stepIdx);
  }

  previous(): void {
    this.stepperService.previousStep();
  }

  next(): void {
    this.stepperService.nextStep();
  }
}
