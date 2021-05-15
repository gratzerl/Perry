import { Component } from '@angular/core';
import { PreferenceCategory, recipePreferences } from '../../constants';
import { RecipeTag } from '../../models';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-preferences-step',
  templateUrl: './preferences-step.component.html',
  styleUrls: ['./preferences-step.component.scss']
})
export class PreferencesStepComponent {

  recipePreferences = recipePreferences;
  categories = PreferenceCategory;

  selectedPreferences: RecipeTag[] = [];

  constructor(private stepperService: RecipeStepperService) { }

  updateSelection(category: PreferenceCategory, selectedPreferences: RecipeTag[]): void {
    this.selectedPreferences = [...selectedPreferences];
    const { preferences } = this.stepperService.data;
    preferences[category] = selectedPreferences;
  }
}
