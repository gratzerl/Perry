import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PreferenceCategory } from '../constants/recipe-preferences.constants';
import { RecipeStepperData } from '../models';

@Injectable()
export class RecipeStepperDataService {

  private stepperData: RecipeStepperData = {
    ingredients: [],
    preferences: {
      [PreferenceCategory.Difficulty]: [],
      [PreferenceCategory.Diet]: []
    }
  };

  private stepperDataComplete$ = new BehaviorSubject<RecipeStepperData>(this.stepperData);

  stepperComplete$ = this.stepperDataComplete$.asObservable();

  get recipeStepperData(): RecipeStepperData {
    return this.stepperData;
  }

  set recipeStepperData(data: RecipeStepperData) {
    this.stepperData = data;
  }

  completeStepper() {
    this.stepperDataComplete$.next(this.stepperData);
  }
}
