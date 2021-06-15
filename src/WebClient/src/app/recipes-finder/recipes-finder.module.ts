import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedModule } from '../shared/shared.module';
import { RecipesFinderRoutingModule } from './recipes-finder-routing.module';
import { RecipeStepperService, ROUTED_STEPS } from './services';
import { recipeFinderSteps } from './constants';
import { RecipesFinderComponent, SuggestionsComponent } from './pages';

import {
  IngredientsStepComponent,
  PreferencesStepComponent,
  RecipesSuggestionsListComponent,
  SummaryStepComponent,
  OptionSelectionCardComponent
} from './components';
import { SelectedItemsPipe } from './pipes/selected-items.pipe';


@NgModule({
  declarations: [
    RecipesFinderComponent,
    IngredientsStepComponent,
    PreferencesStepComponent,
    RecipesSuggestionsListComponent,
    SummaryStepComponent,
    SuggestionsComponent,
    OptionSelectionCardComponent,
    SelectedItemsPipe
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
