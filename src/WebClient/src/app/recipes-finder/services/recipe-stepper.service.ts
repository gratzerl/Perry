import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PreferenceCategory } from '../constants/recipe-preferences.constants';
import { RecipeStepperData } from '../models';
import { RoutedStep, RoutedStepStatus } from '../models/routed-step.model';

export const ROUTED_STEPS = new InjectionToken<RoutedStep[]>('RoutedSteps');

@Injectable()
export class RecipeStepperService {

  private stepperData: RecipeStepperData;
  private currentStepIndex = 0;

  private currentStepChange = new BehaviorSubject<RoutedStep>(this.currentStep);
  private currentStepStatusChange = new BehaviorSubject<RoutedStepStatus>(this.currentStep.status);
  private stepperDataChange: BehaviorSubject<RecipeStepperData>;

  constructor(@Inject(ROUTED_STEPS) private routedSteps: RoutedStep[]) {
    this.stepperData = this.createEmptyStepperData();
    this.stepperDataChange = new BehaviorSubject(this.stepperData);
  }

  goToStepIndex(index: number): void {
    if (index < 0 || index >= this.routedSteps.length) {
      return;
    }

    this.currentStepIndex = index;
    this.updateCurrentStep();
  }

  goToStepRoute(route: string): void {
    const stepIdx = this.steps.findIndex(step => step.route === route);
    if (stepIdx === -1) {
      return;
    }

    this.goToStepIndex(stepIdx);
  }

  nextStep(): void {
    if (this.currentStepIndex < this.routedSteps.length) {
      this.currentStepIndex++;
      this.updateCurrentStep();
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.updateCurrentStep();
    }
  }

  reset(): void {
    this.currentStepIndex = 0;
    this.currentStepChange.next(this.currentStep);
    this.data = this.createEmptyStepperData();
  }

  get currentStep$(): Observable<RoutedStep> {
    return this.currentStepChange.asObservable();
  }

  get currentStepStatus$(): Observable<RoutedStepStatus> {
    return this.currentStepStatusChange.asObservable();
  }

  get data$(): Observable<RecipeStepperData> {
    return this.stepperDataChange.asObservable();
  }

  get currentStep(): RoutedStep {
    return this.routedSteps[this.currentStepIndex]
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

  get data(): RecipeStepperData {
    return this.stepperData;
  }

  set data(data: RecipeStepperData) {
    this.stepperData = data;
    this.stepperDataChange.next(this.stepperData);
  }

  set currentStepStatus(status: RoutedStepStatus) {
    this.currentStep.status = status;
    this.currentStepStatusChange.next(this.currentStep.status);
  }

  private updateCurrentStep(): void {
    this.currentStepChange.next(this.currentStep);
    this.currentStepStatusChange.next(this.currentStep.status);
  }

  private createEmptyStepperData(): RecipeStepperData {
    const preferences = {
      [PreferenceCategory.Difficulty]: [],
      [PreferenceCategory.Diet]: []
    };

    return new RecipeStepperData([], [], preferences, undefined);
  }
}
