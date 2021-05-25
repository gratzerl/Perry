import { RecipeTag } from '../models';

export enum IngredientCategory {
  Meat = 'Meat',
  GrainsPasta = 'GrainsPasta',
}

const labelBasePath = 'rf.ingredients.categories';

const MeatOptions: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.meat.options.beef',
    values: ['beef']
  },
  {
    labelKey: labelBasePath + '.meat.options.pork',
    values: ['pork']
  },
  {
    labelKey: labelBasePath + '.meat.options.chicken',
    values: ['chicken']
  },
  {
    labelKey: labelBasePath + '.meat.options.turkey',
    values: ['turkey']
  },
  {
    labelKey: labelBasePath + '.meat.options.lamb',
    values: ['lamb']
  }
];

const GrainsPastaOptions: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.grainspasta.options.oats',
    values: ['oat']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.farro',
    values: ['farro']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.bulgur',
    values: ['bulgur']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.rice',
    values: ['rice']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.quinoa',
    values: ['quinoa']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.couscous',
    values: ['couscous']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.lentils',
    values: ['lentils']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.pasta',
    values: ['pasta']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.gnocchi',
    values: ['gnocchi']
  },
];

export const ingredientCategoryOptions: { [key in IngredientCategory]: RecipeTag[] } = {
  [IngredientCategory.Meat]: MeatOptions,
  [IngredientCategory.GrainsPasta]: GrainsPastaOptions
};
