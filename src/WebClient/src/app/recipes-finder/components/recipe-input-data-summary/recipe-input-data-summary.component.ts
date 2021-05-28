import { Component, Input, OnChanges } from '@angular/core';
import { PreferenceCategory } from '../../constants';
import { RecipeStepperData } from '../../models';

@Component({
  selector: 'app-recipe-input-data-summary',
  templateUrl: './recipe-input-data-summary.component.html',
  styleUrls: ['./recipe-input-data-summary.component.scss']
})
export class RecipeInputDataSummaryComponent implements OnChanges {

  @Input()
  recipeData!: RecipeStepperData;

  preferenceCategory = PreferenceCategory;

  hasSelectedPreferences = false;

  constructor() { }

  ngOnChanges(): void {
    const { preferences } = this.recipeData;

    this.hasSelectedPreferences = Object.values(preferences).some(items => items.length > 0);
  }

}
