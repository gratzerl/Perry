import { PreferenceCategory } from "../constants/recipe-preferences.constants";
import { RecipeTag } from "./recipe-tag.model";

export interface RecipeStepperData {
  ingredients: string[],
  preferences: { [key in PreferenceCategory]: RecipeTag[] }
}
