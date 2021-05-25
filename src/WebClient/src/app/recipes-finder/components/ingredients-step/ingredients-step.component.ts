import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs/operators';
import { ingredientCategoryOptions, IngredientCategory } from '../../constants';

import { RecipeTag, RoutedStepStatus, SelectionItem } from '../../models';
import { IngredientsIdentificationService, RecipeStepperService } from '../../services';

@Component({
  selector: 'app-ingredients-step',
  templateUrl: './ingredients-step.component.html',
  styleUrls: ['./ingredients-step.component.scss']
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

        this.insertOrUpdateIngredients(items);
      });
  }

  insertOrUpdateIngredients(updatedIngredients: SelectionItem<string>[]): void {
    updatedIngredients.forEach(updated => {
      const existingItem = this.ingredients.find(ingredient => updated.item === ingredient.item);
      if (existingItem !== undefined) {
        existingItem.checked = updated.checked;
      } else {
        this.ingredients.push(updated);
      }
    });

    this.ingredients = this.ingredients.filter(item => item.checked);

    this.stepperService.currentStepStatus = this.ingredients.length > 0 ? RoutedStepStatus.Valid : RoutedStepStatus.Invalid;
    this.stepperService.data.ingredients = [...this.ingredients];
  }

  updateSelection(category: IngredientCategory, option: SelectionItem<RecipeTag>, isSelected: boolean): void {
    const pref = this.ingredientOptions[category].find(o => o === option);
    if (!pref) {
      return;
    }

    pref.checked = isSelected;

    const { values } = option.item;
    const updated = values.map(ingredient => ({ label: ingredient, item: ingredient, checked: isSelected }))
    this.insertOrUpdateIngredients(updated);
  }
}
