import { Component, OnInit } from '@angular/core';
import { PreferenceCategory, recipePreferences } from '../../constants';
import { RecipeTag, SelectionItem } from '../../models';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-preferences-step',
  templateUrl: './preferences-step.component.html',
  styleUrls: ['./preferences-step.component.less']
})
export class PreferencesStepComponent implements OnInit {
  preferenceCategories = PreferenceCategory;

  preferences: { [key in PreferenceCategory]: SelectionItem<RecipeTag>[] } = {
    [PreferenceCategory.Difficulty]: [],
    [PreferenceCategory.Diet]: []
  }

  constructor(public stepperService: RecipeStepperService) { }

  ngOnInit(): void {
    const { preferences } = this.stepperService.data;

    Object.entries(recipePreferences)
      .map(([keyStr, tags]) => {
        const key = keyStr as keyof typeof PreferenceCategory;
        this.preferences[key] = tags.map<SelectionItem<RecipeTag>>(tag => {
          const p = preferences[key].find(selItem => selItem.item.labelKey === tag.labelKey);
          return ({ item: tag, checked: p !== undefined ? p.checked : false });
        });
      });
  }

  updateSelection(category: PreferenceCategory, preference: SelectionItem<RecipeTag>): void {
    const pref = this.preferences[category].find(p => p === preference);
    if (!pref) {
      return;
    }

    pref.checked = preference.checked;
    this.stepperService.data.preferences[category] = [...this.preferences[category]];
  }
}
