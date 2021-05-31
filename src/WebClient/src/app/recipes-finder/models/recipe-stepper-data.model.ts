import { NzUploadFile } from "ng-zorro-antd/upload";
import { PreferenceCategory } from "../constants";
import { RecipeTag } from "./recipe-tag.model";
import { SelectionItem } from "./selection-item.model";

export class RecipeStepperData {
  constructor(
    public images: NzUploadFile[],
    public ingredients: SelectionItem<string>[],
    public preferences: { [key in PreferenceCategory]: SelectionItem<RecipeTag>[] }
  ) { }

  hasData(): boolean {
    return this.hasIngredients() || this.hasSelectedPreferences();
  }

  hasIngredients(): boolean {
    return this.ingredients.length > 0;
  }

  hasSelectedPreferences(): boolean {
    return Object.values(this.preferences).some(items => items.length > 0);
  }
}
