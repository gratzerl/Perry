import { Component } from '@angular/core';
import { PreferenceCategory, RecipePreferences } from '../../constants/recipe-preferences.constants';
import { RecipeTag } from '../../models';
import { RecipeStepperDataService } from '../../services';

@Component({
  selector: 'app-preferences-step',
  templateUrl: './preferences-step.component.html',
  styleUrls: ['./preferences-step.component.scss']
})
export class PreferencesStepComponent {

  recipePreferences = RecipePreferences;
  categories = PreferenceCategory;

  selectedPreferences: RecipeTag[] = [];

  constructor(private recipeDataService: RecipeStepperDataService) { }

  updateSelection(category: PreferenceCategory, selectedPreferences: RecipeTag[]): void {
    this.selectedPreferences = [...selectedPreferences];
    const { preferences } = this.recipeDataService.recipeStepperData;
    preferences[category] = selectedPreferences;
  }
}
