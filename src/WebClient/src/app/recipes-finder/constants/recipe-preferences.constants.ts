import { RecipeTag } from "../models";

export enum PreferenceCategory {
  Diet = 'Diet',
  Difficulty = 'Difficulty',
  Category = 'Category'
}

const labelBasePath = 'rf.preferences.categories';
const DietPreferences: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.diet.options.vegetarian',
    values: ['vegetarian', 'vegetariancategory', 'Vegetarian']
  },
  {
    labelKey: labelBasePath + '.diet.options.vegan',
    values: ['vegan', 'plant-based', 'Vegan']
  },
  {
    labelKey: labelBasePath + '.diet.options.lowcholesterol',
    values: ['lowcholesterol']
  },  
  {
    labelKey: labelBasePath + '.diet.options.lowfat',
    values: ['Low fat', 'lowfat']
  },
  {
    labelKey: labelBasePath + '.diet.options.dairyfree',
    values: ['Dairy-free', 'dairyfree', 'nondairy']
  },
  {
    labelKey: labelBasePath + '.diet.options.glutenfree',
    values: ['Gluten-free', 'glutenfree']
  },
  {
    labelKey: labelBasePath + '.diet.options.lowcarb',
    values: ['lowcarb', 'lowcalorie']
  },
  {
    labelKey: labelBasePath + '.diet.options.healthy',
    values: ['Healthy', 'hearthealthy']
  },
  {
    labelKey: labelBasePath + '.diet.options.diabetic',
    values: ['diabetic', 'diabeticlivingmagazine']
  },
  {
    labelKey: labelBasePath + '.diet.options.organic',
    values: ['organic', 'naturesown']
  },
  {
    labelKey: labelBasePath + '.diet.options.sugarfree',
    values: ['sugarfree']
  },
  {
    labelKey: labelBasePath + '.diet.options.kosher',
    values: ['kosher']
  }
];

const DifficultyPreferences: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.difficulty.options.easy',
    values: ['easy', 'beginner', 'quickandeasy', 'quickandeasycategory', 'recipes30minsless', 'kidchefs']
  },
  {
    labelKey: labelBasePath + '.difficulty.options.medium',
    values: ['medium']
  },
  {
    labelKey: labelBasePath + '.difficulty.options.hard',
    values: ['hard', 'difficult', 'advanced', 'experienced']
  }
];

const CategoryPreferences: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.category.options.spicy',
    values: ['spicyfoods', 'spicetotaste', 'hotsauce']
  },
  {
    labelKey: labelBasePath + '.category.options.salads',
    values: ['saladscategory', 'coleslaw', 'salads', 'saladdressingsewmealtype', 'saladdressing']
  },
  {
    labelKey: labelBasePath + '.category.options.pasta',
    values: ['pastacategory', 'lasagna', 'pasta', 'spaghetti']
  },
  {
    labelKey: labelBasePath + '.category.options.spreadsSauces',
    values: ['dipsandspreads', 'dipsandsalsasewmealtype', 'saucescategory', 'salsa', 'dippable', 'sauces']
  },
  {
    labelKey: labelBasePath + '.category.options.desserts',
    values: ['cookies', 'chocolatechips', 'semisweetchocolate', 'pies', 'cupcakes', 'muffins', 'candy',
    'muffin', 'cakecategory', 'chocolate', 'cheesecake', 'icecream', 'bakeware', 'cookieampcandycategory',
    'otherdesserts', 'desserts', 'pancakesandwaffles', 'piecrispscrumblescobblersetccategory', 'custardandpudding']
  },
  {
    labelKey: labelBasePath + '.category.options.seafood',
    values: ['seafoodcategory', 'fishandseafood', 'salmon', 'shrimp', 'shellfish', 'combinationfishseafoodewmealtype', 'tuna']
  },
  {
    labelKey: labelBasePath + '.category.options.european',
    values: ['german', 'dutchoven', 'italian', 'italianinspired', 'european', 'italianseasoning', 'italiancategory', 'french']
  },
  {
    labelKey: labelBasePath + '.category.options.american',
    values: ['americancuisine', 'hamburgers', 'cajun', 'bacon']
  },
  {
    labelKey: labelBasePath + '.category.options.indian',
    values: ['indian']
  },
  {
    labelKey: labelBasePath + '.category.options.african',
    values: ['african']
  },
  {
    labelKey: labelBasePath + '.category.options.orient',
    values: ['middleeastern']
  },
  {
    labelKey: labelBasePath + '.category.options.italian',
    values: ['italian', 'italianinspired', 'italianseasoning', 'italiancategory']
  },
  {
    labelKey: labelBasePath + '.category.options.asian',
    values: ['southasian', 'asiancategory', 'korean', 'asian', 'thai', 'chinese']
  },
  {
    labelKey: labelBasePath + '.category.options.mexican',
    values: ['mexican', 'mexicancategory', 'mexicaninspired', 'tortilla', 'salsa', 'cincodemayo']
  },
];

export const recipePreferences: { [key in PreferenceCategory]: RecipeTag[] } = {
  [PreferenceCategory.Diet]: DietPreferences,
  [PreferenceCategory.Difficulty]: DifficultyPreferences,
  [PreferenceCategory.Category]: CategoryPreferences
};
