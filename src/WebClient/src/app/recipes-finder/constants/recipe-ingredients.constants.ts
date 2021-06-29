import { RecipeTag } from '../models';

export enum IngredientCategory {
  Meat = 'Meat',
  GrainsPasta = 'GrainsPasta',
  Dairy = 'Dairy',
  Spice = 'Spice',
  Vegetable = 'Vegetable',
  Fruit = 'Fruit',
}

const labelBasePath = 'rf.ingredients.categories';

const MeatOptions: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.meat.options.beef',
    values: ['beef', 'minced meat', 'groundbeef', 'ground meat', 'meat']
  },
  {
    labelKey: labelBasePath + '.meat.options.pork',
    values: ['pork', 'bacon']
  },
  {
    labelKey: labelBasePath + '.meat.options.chicken',
    values: ['chicken', 'chickenstock', 'chickencategory', 'chickenbreast']
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
    values: ['oat', 'oatmeal', 'oats']
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
    labelKey: labelBasePath + '.grainspasta.options.barley',
    values: ['barley']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.amaranth',
    values: ['amaranth']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.teff',
    values: ['teff']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.freekeh',
    values: ['freekeh']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.millet',
    values: ['millet']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.bread',
    values: ['bread', 'buns']
  },  
  {
    labelKey: labelBasePath + '.grainspasta.options.flour',
    values: ['flour']
  },
  {
    labelKey: labelBasePath + '.grainspasta.options.pasta',
    values: ['pasta', 'lasagna', 'spaghetti', 'macaroni', 'angel hair pasta', 'farfalle', 'egg noodles', 'shells', 'tagliatelle',
              'fettuccine', 'fusilli', 'gemelli', 'linguine', 'manicotti', 'orecchiette', 'penne', 'ravioli', 'tortellini', 'gnocchi']
  },
];

const DairyOptions: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.dairy.options.cheese',
    values: ['cheese', 'parmesan', 'gouda', 'edamer', 'cheddar']
  },
  {
    labelKey: labelBasePath + '.dairy.options.milk',
    values: ['milk', 'buttermilk']
  },
  {
    labelKey: labelBasePath + '.dairy.options.yoghurt',
    values: ['yoghurt']
  },
  {
    labelKey: labelBasePath + '.dairy.options.sourcream',
    values: ['sourcream']
  },
  {
    labelKey: labelBasePath + '.dairy.options.butter',
    values: ['butter']
  },
  {
    labelKey: labelBasePath + '.dairy.options.egg',
    values: ['egg']
  }
];

const SpiceOptions: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.spice.options.salt',
    values: ['salt']
  },
  {
    labelKey: labelBasePath + '.spice.options.pepper',
    values: ['pepper', 'black pepper']
  },
  {
    labelKey: labelBasePath + '.spice.options.chiliflakes',
    values: ['chiliflakes', 'chili']
  },
  {
    labelKey: labelBasePath + '.spice.options.ceyennePepper',
    values: ['cayenne pepper']
  },
  {
    labelKey: labelBasePath + '.spice.options.nutmeg',
    values: ['nutmeg']
  },
  {
    labelKey: labelBasePath + '.spice.options.ginger',
    values: ['ginger']
  },
  {
    labelKey: labelBasePath + '.spice.options.cloves',
    values: ['cloves']
  },
  {
    labelKey: labelBasePath + '.spice.options.cinnamon',
    values: ['cinnamon']
  },  
  {
    labelKey: labelBasePath + '.spice.options.cumin',
    values: ['cumin']
  },
  {
    labelKey: labelBasePath + '.spice.options.paprika',
    values: ['paprika', 'red paprika']
  },
  {
    labelKey: labelBasePath + '.spice.options.coriander',
    values: ['coriander']
  },
  {
    labelKey: labelBasePath + '.spice.options.thyme',
    values: ['thyme']
  },
  {
    labelKey: labelBasePath + '.spice.options.rosemary',
    values: ['rosemary']
  },
  {
    labelKey: labelBasePath + '.spice.options.garlic',
    values: ['garlic']
  },
  {
    labelKey: labelBasePath + '.spice.options.oregano',
    values: ['oregano']
  },
  {
    labelKey: labelBasePath + '.spice.options.curry',
    values: ['curry powder']
  },
];

const FruitOptions: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.fruit.options.apple',
    values: ['apple']
  },
  {
    labelKey: labelBasePath + '.fruit.options.banana',
    values: ['banana']
  },
  {
    labelKey: labelBasePath + '.fruit.options.lemon',
    values: ['lemon']
  },
  {
    labelKey: labelBasePath + '.fruit.options.strawberry',
    values: ['strawberries', 'strawberry']
  },
  {
    labelKey: labelBasePath + '.fruit.options.blueberry',
    values: ['blueberries', 'blueberry']
  },
  {
    labelKey: labelBasePath + '.fruit.options.grape',
    values: ['grape']
  },
  {
    labelKey: labelBasePath + '.fruit.options.orange',
    values: ['orange']
  },
  {
    labelKey: labelBasePath + '.fruit.options.pear',
    values: ['pear']
  },
  {
    labelKey: labelBasePath + '.fruit.options.tomato',
    values: ['tomato', 'tomatoes']
  },
  {
    labelKey: labelBasePath + '.fruit.options.pineapple',
    values: ['pineapple']
  },
  {
    labelKey: labelBasePath + '.fruit.options.kiwi',
    values: ['kiwi']
  },
  {
    labelKey: labelBasePath + '.fruit.options.mango',
    values: ['mango']
  },
  {
    labelKey: labelBasePath + '.fruit.options.pomegranate',
    values: ['pomegranate']
  },
  {
    labelKey: labelBasePath + '.fruit.options.grapefruit',
    values: ['grapefruit']
  },
];

const VegetableOptions: RecipeTag[] = [
  {
    labelKey: labelBasePath + '.vegetable.options.carrot',
    values: ['carrot']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.potato',
    values: ['chiliflakes', 'chili']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.onion',
    values: ['onion']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.beans',
    values: ['beans', 'kidney beans']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.garlic',
    values: ['garlic']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.pepper',
    values: ['pepper', 'bell pepper', 'pepper red', 'pepper yellow']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.aubergine',
    values: ['aubergine', 'eggplant']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.avocado',
    values: ['avocado']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.ginger',
    values: ['ginger']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.mushroom',
    values: ['mushroom']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.salad',
    values: ['salad']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.broccoli',
    values: ['broccoli']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.cabbage',
    values: ['cabbage']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.cauliflower',
    values: ['cauliflower']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.chickpeas',
    values: ['chickpeas']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.corn',
    values: ['corn']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.cucumber',
    values: ['cucumber']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.leek',
    values: ['leek']
  },
  {
    labelKey: labelBasePath + '.vegetable.options.zucchini',
    values: ['zucchini']
  }
];


export const ingredientCategoryOptions: { [key in IngredientCategory]: RecipeTag[] } = {
  [IngredientCategory.Meat]: MeatOptions,
  [IngredientCategory.GrainsPasta]: GrainsPastaOptions,
  [IngredientCategory.Dairy]: DairyOptions,
  [IngredientCategory.Spice]: SpiceOptions,
  [IngredientCategory.Vegetable]: VegetableOptions,
  [IngredientCategory.Fruit]: FruitOptions
};
