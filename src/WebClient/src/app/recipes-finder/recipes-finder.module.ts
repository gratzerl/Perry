import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedModule } from '../shared/shared.module';
import { RecipesFinderRoutingModule } from './recipes-finder-routing.module';
import { RecipesFinderComponent } from './pages';
import { RecipeStepperService, ROUTED_STEPS } from './services';
import { recipeFinderSteps } from './constants';
import {
  IngredientSelectionComponent,
  PerferenceSelectionComponent,
  IngredientsStepComponent,
  PreferencesStepComponent,
  RecipeSuggestionStepperComponent
} from './components';


@NgModule({
  declarations: [
    RecipesFinderComponent,
    IngredientsStepComponent,
    IngredientSelectionComponent,
    PerferenceSelectionComponent,
    PreferencesStepComponent,
    RecipeSuggestionStepperComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipesFinderRoutingModule
  ],
  providers: [
    RecipeStepperService,
    { provide: ROUTED_STEPS, useValue: recipeFinderSteps },
    { provide: TRANSLOCO_SCOPE, useValue: { scope: 'recipes-finder', alias: 'rf' } }
  ]
})
export class RecipesFinderModule { }
