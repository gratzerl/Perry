import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MenuItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil, pluck } from 'rxjs/operators';
import { RoutedStep, RoutedStepStatus } from '../../models';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-recipe-suggestion-stepper',
  templateUrl: './recipe-suggestion-stepper.component.html',
  styleUrls: ['./recipe-suggestion-stepper.component.scss']
})
export class RecipeSuggestionStepperComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  steps: MenuItem[] = [];
  stepStatus = RoutedStepStatus;
  currentStep?: RoutedStep;

  constructor(public stepperService: RecipeStepperService, private transloco: TranslocoService, private router: Router, private route: ActivatedRoute) { }

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

  private createStepItems(): MenuItem[] {
    return this.stepperService.steps.map<MenuItem>(step => ({
      label: this.transloco.translate(step.labelKey),
      routerLink: step.route
    }));
  }
}
