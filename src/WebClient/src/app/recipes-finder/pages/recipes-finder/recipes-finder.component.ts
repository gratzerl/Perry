import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointQuery } from 'src/app/core/constants/general.constants';
import { RoutedStepStatus, RoutedStep } from '../../models';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-recipes-finder',
  templateUrl: './recipes-finder.component.html',
  styleUrls: ['./recipes-finder.component.scss']
})
export class RecipesFinderComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  isSmallScreen = false;
  stepStatus = RoutedStepStatus;
  currentStep?: RoutedStep;
  currentStepIndex = 0;

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

  complete(): void {
    this.stepperService.complete();
  }

  previous(): void {
    this.currentStepIndex--;
    this.stepperService.previousStep();
  }

  next(): void {
    this.currentStepIndex++;
    this.stepperService.nextStep();
  }
}
