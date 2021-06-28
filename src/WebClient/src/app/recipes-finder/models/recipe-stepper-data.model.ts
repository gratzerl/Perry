import { NzUploadFile } from "ng-zorro-antd/upload";
import { PreferenceCategory } from "../constants";
import { RecipeTag } from "./recipe-tag.model";
import { SelectionItem } from "./selection-item.model";

export class RecipeStepperData {
  constructor(
    public images: NzUploadFile[],
    public additionalIngredients: SelectionItem<string>[],
    public preferences: { [key in PreferenceCategory]: SelectionItem<RecipeTag>[] },
    public identifiedIngredients: SelectionItem<string>[] | undefined
  ) { }

  get checkedIngredients(): SelectionItem<string>[] {
    const { additionalIngredients, identifiedIngredients } = this;

    let ingredients: SelectionItem<string>[] = [];

    if (additionalIngredients) {
      ingredients = additionalIngredients
        .filter(item => item.checked);
    }

    if (identifiedIngredients) {
      const selected = identifiedIngredients
        .filter(item => item.checked);

      ingredients = ingredients.concat(selected);
    }

    return ingredients;
  }

  hasData(): boolean {
    return this.hasIdentifiedIngredients() || this.hasAdditionalIngredients();
  }

  hasIdentifiedIngredients(): boolean {
    if (this.identifiedIngredients === undefined) {
      return false;
    }

    return this.identifiedIngredients.length > 0;
  }

  hasAdditionalIngredients(): boolean {
    return this.additionalIngredients.length > 0;
  }

  arePreferencesSelected(): boolean {
    return Object.values(this.preferences).some(items => items.length > 0 && items.some(item => item.checked));
  }

  areIngredientsSelected(): boolean {
    const areIdentifiedSelected = this.hasIdentifiedIngredients() &&
      this.identifiedIngredients !== undefined &&
      this.identifiedIngredients.some(item => item.checked);

    const areAdditionalSelected = this.hasAdditionalIngredients() && this.additionalIngredients.some(item => item.checked);

    return areAdditionalSelected || areIdentifiedSelected;
  }
}
