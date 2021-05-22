import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PreferenceCategory } from '../constants/recipe-preferences.constants';
import { RecipeStepperData } from '../models';
import { RoutedStep, RoutedStepStatus } from '../models/routed-step.model';

export const ROUTED_STEPS = new InjectionToken<RoutedStep[]>('RoutedSteps');

@Injectable()
export class RecipeStepperService {

  private stepperData: RecipeStepperData;

  private currentStepIndex = 0;
  private stepperComplete = new Subject<RecipeStepperData>();
  private currentStepChange = new BehaviorSubject<RoutedStep>(this.currentStep);
  private currentStepStatusChange = new BehaviorSubject<RoutedStepStatus>(this.currentStep.status);

  constructor(@Inject(ROUTED_STEPS) private routedSteps: RoutedStep[]) {
    this.stepperData = this.createEmptyStepperData();
  }

  nextStep(): void {
    if (this.currentStepIndex < this.routedSteps.length) {
      this.currentStepIndex++;
      this.currentStepChange.next(this.currentStep);
      this.currentStepStatusChange.next(this.currentStep.status);
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.currentStepChange.next(this.currentStep);
      this.currentStepStatusChange.next(this.currentStep.status);
    }
  }

  complete(): void {
    this.stepperComplete.next(this.stepperData);
  }

  reset(): void {
    this.currentStepIndex = 0;
    this.currentStepChange.next(this.currentStep);
    this.stepperData = this.createEmptyStepperData();
  }

  get steps(): RoutedStep[] {
    return this.routedSteps;
  }

  get isFirstStep(): boolean {
    return this.currentStepIndex == 0;
  }

  get isLastStep(): boolean {
    return this.currentStepIndex == this.routedSteps.length - 1;
  }

  get stepperComplete$(): Observable<RecipeStepperData> {
    return this.stepperComplete.asObservable();
  }

  get currentStep$(): Observable<RoutedStep> {
    return this.currentStepChange.asObservable();
  }

  get currentStepStatus$(): Observable<RoutedStepStatus> {
    return this.currentStepStatusChange.asObservable();
  }

  get currentStep(): RoutedStep {
    return this.routedSteps[this.currentStepIndex]
  }

  get data(): RecipeStepperData {
    return this.stepperData;
  }

  set data(data: RecipeStepperData) {
    this.stepperData = data;
  }

  set currentStepStatus(status: RoutedStepStatus) {
    this.currentStep.status = status;
    this.currentStepStatusChange.next(this.currentStep.status);
  }

  private createEmptyStepperData(): RecipeStepperData {
    return {
      ingredients: [],
      preferences: {
        [PreferenceCategory.Difficulty]: [],
        [PreferenceCategory.Diet]: []
      }
    };
  }
}
