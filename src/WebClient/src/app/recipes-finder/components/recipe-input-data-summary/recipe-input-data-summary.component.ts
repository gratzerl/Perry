import { Component, Input, OnInit } from '@angular/core';
import { RecipeStepperData } from '../../models';

@Component({
  selector: 'app-recipe-input-data-summary',
  templateUrl: './recipe-input-data-summary.component.html',
  styleUrls: ['./recipe-input-data-summary.component.scss']
})
export class RecipeInputDataSummaryComponent {

  @Input()
  recipeData!: RecipeStepperData;

  constructor() { }

}
