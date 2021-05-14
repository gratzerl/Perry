import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { RecipesFinderRoutingModule } from './recipes-finder-routing.module';
import { RecipesFinderComponent } from './pages';
import { IngredientSelectionComponent, PerferenceSelectionComponent, IngredientsStepComponent } from './components';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { RecipeStepperDataService } from './services';
import { PreferencesStepComponent } from './components/preferences-step/preferences-step.component';

@NgModule({
  declarations: [
    RecipesFinderComponent,
    IngredientsStepComponent,
    IngredientSelectionComponent,
    PerferenceSelectionComponent,
    PreferencesStepComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipesFinderRoutingModule
  ],
  providers: [
    RecipeStepperDataService,
    { provide: TRANSLOCO_SCOPE, useValue: { scope: 'recipes-finder', alias: 'rf' } }
  ]
})
export class RecipesFinderModule { }
