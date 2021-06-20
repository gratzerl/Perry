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

  additionalIngredients: SelectionItem<string>[] = [];

  ingredientCategories = IngredientCategory;
  ingredientOptions: { [key in IngredientCategory]: SelectionItem<RecipeTag>[] } = {
    [IngredientCategory.Meat]: [],
    [IngredientCategory.GrainsPasta]: [],
    [IngredientCategory.DairyEgg]: [],
    [IngredientCategory.Spice]: [],
    [IngredientCategory.Vegetable]: [],
    [IngredientCategory.Fruit]: [],
  }

  constructor(private ingredientIdentificationService: IngredientsIdentificationService, public stepperService: RecipeStepperService) {
  }

  ngOnInit(): void {
    const { additionalIngredients, images } = this.stepperService.data;

    this.imageFiles = [...images];

    Object.entries(ingredientCategoryOptions)
      .map(([keyStr, tags]) => {
        const key = keyStr as keyof typeof IngredientCategory;

        this.ingredientOptions[key] = tags.map<SelectionItem<RecipeTag>>(tag => {
          const p = additionalIngredients.find(ingredient => tag.values.includes(ingredient.item));
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
      .subscribe(
        ingredients => {
          let items = ingredients.map<SelectionItem<string>>(i => ({ label: i, item: i, checked: true }));
          this.updateIdentifiedIngredients(items);
        },
        () => this.isLoading = false
      );
  }

  updateIdentifiedIngredients(newIngredients: SelectionItem<string>[]): void {
    let { identifiedIngredients } = this.stepperService.data;

    if (identifiedIngredients === undefined) {
      identifiedIngredients = [...newIngredients];
    } else {
      newIngredients.forEach(newIngredient => {
        const ingredient = identifiedIngredients?.find(value => value.item === newIngredient.item);
        if (ingredient === undefined) {
          identifiedIngredients?.push(newIngredient);
        } else {
          ingredient.checked = newIngredient.checked;
        }
      });
    }

    this.stepperService.data.identifiedIngredients = [...identifiedIngredients];
    this.updateStepperStatus();
  }

  updateAdditionalIngredients(category: IngredientCategory, option: SelectionItem<RecipeTag>): void {
    let updated = option.item.values.map<SelectionItem<string>>(i => ({ label: i, item: i, checked: option.checked }));

    let allIngredients: SelectionItem<string>[] = [];
    this.ingredientOptions[category].map(recipeTag => {
      const values = recipeTag.item.values.map(i => ({ label: i, item: i, checked: false }));
      allIngredients = allIngredients.concat(values);
    });

    const { additionalIngredients } = this.stepperService.data;
    updated = this.insertOrUpdateIngredients(allIngredients, updated, additionalIngredients);
    this.stepperService.data.additionalIngredients = [...updated];

    this.updateStepperStatus();
  }

  updateStepperStatus(): void {
    const { data } = this.stepperService;
    const anyIngredientsSelected = data.areIngredientsSelected();

    this.stepperService.currentStepStatus = anyIngredientsSelected ? RoutedStepStatus.Valid : RoutedStepStatus.Invalid;
  }

  private insertOrUpdateIngredients(allAvailableIngredients: SelectionItem<string>[], selectedIngredients: SelectionItem<string>[], target: SelectionItem<string>[]): SelectionItem<string>[] {
    allAvailableIngredients.forEach(ingredient => {
      const currSelected = selectedIngredients.find(i => ingredient.item === i.item);
      const alreadySelected = target.find(i => ingredient.item === i.item);

      if (currSelected !== undefined) {
        if (alreadySelected !== undefined) {
          alreadySelected.checked = currSelected.checked;
        } else {
          target.push(currSelected);
        }
      }
    });

    return target;
  }
}
