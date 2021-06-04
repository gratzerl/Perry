import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs/operators';
import { ingredientCategoryOptions, IngredientCategory } from '../../constants';
import { RecipeTag, RoutedStepStatus, SelectionItem } from '../../models';
import { IngredientsIdentificationService, RecipeStepperService } from '../../services';

@Component({
  selector: 'app-ingredients-step',
  templateUrl: './ingredients-step.component.html',
  styleUrls: ['./ingredients-step.component.less']
})
export class IngredientsStepComponent implements OnInit {

  readonly maxImageSizeKb = 4000;

  isLoading = false;

  imageFiles: NzUploadFile[] = [];
  identifiedIngredients?: SelectionItem<string>[] = undefined;

  ingredients: SelectionItem<string>[] = [];

  ingredientCategories = IngredientCategory;
  ingredientOptions: { [key in IngredientCategory]: SelectionItem<RecipeTag>[] } = {
    [IngredientCategory.Meat]: [],
    [IngredientCategory.GrainsPasta]: []
  }

  constructor(private ingredientIdentificationService: IngredientsIdentificationService, private stepperService: RecipeStepperService) {
    if (this.stepperService.data.ingredients.length > 0) {
      this.ingredients = [...this.stepperService.data.ingredients];
      this.imageFiles = [...this.stepperService.data.images];
    }
  }

  ngOnInit(): void {
    const { ingredients } = this.stepperService.data;

    Object.entries(ingredientCategoryOptions)
      .map(([keyStr, tags]) => {
        const key = keyStr as keyof typeof IngredientCategory;

        this.ingredientOptions[key] = tags.map<SelectionItem<RecipeTag>>(tag => {
          const p = ingredients.find(ingredient => tag.values.includes(ingredient.item));
          return ({ item: tag, checked: p !== undefined ? p.checked : false });
        });
      });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.imageFiles = this.imageFiles.concat(file);
    this.stepperService.data.images = this.imageFiles;
    return false;
  };

  identifyIngredients(): void {
    this.stepperService.currentStepStatus = RoutedStepStatus.Loading;
    this.isLoading = true;

    this.ingredientIdentificationService.identifyIngredientsInImages(this.imageFiles)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(ingredients => {
        const items = ingredients.map(i => ({ label: i, item: i, checked: true }));
        this.identifiedIngredients = [...items];

        this.insertOrUpdateIngredients(this.identifiedIngredients, items);
      });
  }

  insertOrUpdateIngredients(allIngredients: SelectionItem<string>[], selectedIngredients: SelectionItem<string>[]): void {
    console.log('selected', selectedIngredients);

    allIngredients.forEach(ingredient => {
      const currSelected = selectedIngredients.find(i => ingredient.item === i.item);
      const alreadySelected = this.ingredients.find(i => ingredient.item === i.item);

      // ingredient was unselected by the user but it was already selected previously
      if (currSelected === undefined && alreadySelected !== undefined) {
        alreadySelected.checked = false;
      }
      // user reselected ingredient
      else if (currSelected !== undefined && alreadySelected !== undefined) {
        alreadySelected.checked = currSelected.checked;
      }
      // ingredient was selected by the user and it was not already selected
      else if (currSelected !== undefined && alreadySelected === undefined) {
        this.ingredients.push(currSelected);
      }
    });

    // this.ingredients = this.ingredients.filter(item => item.checked);
    const hasSelectedItems = this.ingredients.some(ingredient => ingredient.checked);
    this.stepperService.currentStepStatus = hasSelectedItems ? RoutedStepStatus.Valid : RoutedStepStatus.Invalid;
    this.stepperService.data.ingredients = [...this.ingredients];

    console.log('stepper', this.stepperService.data.ingredients);
  }

  updateSelection(category: IngredientCategory, option: SelectionItem<RecipeTag>): void {
    const pref = this.ingredientOptions[category].find(o => o === option);
    if (!pref) {
      return;
    }

    pref.checked = option.checked;

    const updated = option.item.values.map(i => ({ label: i, item: i, checked: option.checked }));

    let allIngredients: SelectionItem<string>[] = [];
    this.ingredientOptions[category].map(recipeTag => {
      const values = recipeTag.item.values.map(i => ({ label: i, item: i, checked: false }));
      allIngredients = allIngredients.concat(values);
    });

    this.insertOrUpdateIngredients(allIngredients, updated);
  }
}
