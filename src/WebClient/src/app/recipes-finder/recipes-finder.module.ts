import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { SharedModule } from '../shared/shared.module';
import { RecipesFinderRoutingModule } from './recipes-finder-routing.module';
import { RecipesFinderComponent } from './pages/recipes-finder/recipes-finder.component';


@NgModule({
  declarations: [
    RecipesFinderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipesFinderRoutingModule
  ]
})
export class RecipesFinderModule { }
