import { PreferenceCategory } from "../constants/recipe-preferences.constants";
import { RecipeTag } from "./recipe-tag.model";
import { SelectionItem } from "./selection-item.model";

export interface RecipeStepperData {
  ingredients: SelectionItem<string>[],
  preferences: { [key in PreferenceCategory]: SelectionItem<RecipeTag>[] }
}
