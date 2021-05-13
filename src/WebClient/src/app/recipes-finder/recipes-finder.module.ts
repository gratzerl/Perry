import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { RecipesFinderRoutingModule } from './recipes-finder-routing.module';
import { RecipesFinderComponent } from './pages';
import { IngredientsIdentificationComponent, IngredientSelectionComponent, PerferenceSelectionComponent } from './components';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [
    RecipesFinderComponent,
    IngredientsIdentificationComponent,
    IngredientSelectionComponent,
    PerferenceSelectionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipesFinderRoutingModule
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: { scope: 'recipes-finder', alias: 'rf' } }
  ]
})
export class RecipesFinderModule { }
