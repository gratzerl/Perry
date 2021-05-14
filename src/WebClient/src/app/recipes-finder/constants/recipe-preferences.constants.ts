import { RecipeTag } from "../models";

export enum PreferenceCategory {
  Diet = 'diet',
  Difficulty = 'difficulty'
}

const labelBasePath = 'rf.preferences.categories';
const DietPreferences: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.diet.options.vegetarian',
    values: ['vegetarian']
  },
  {
    labelKey: labelBasePath + '.diet.options.vegan',
    values: ['vegan', 'plant-based']
  }
];

const DifficultyPreferences: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.difficulty.options.easy',
    values: ['easy', 'beginner']
  },
  {
    labelKey: labelBasePath + '.difficulty.options.medium',
    values: ['medium']
  },
  {
    labelKey: labelBasePath + '.difficulty.options.hard',
    values: ['hard', 'difficult']
  }
];

export const RecipePreferences: { [key in PreferenceCategory]: RecipeTag[] } = {
  [PreferenceCategory.Diet]: DietPreferences,
  [PreferenceCategory.Difficulty]: DifficultyPreferences
}
