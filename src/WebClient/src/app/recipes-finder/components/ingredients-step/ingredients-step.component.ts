import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs/operators';

import { RoutedStepStatus, SelectionItem } from '../../models';
import { IngredientsIdentificationService, RecipeStepperService } from '../../services';

@Component({
  selector: 'app-ingredients-step',
  templateUrl: './ingredients-step.component.html',
  styleUrls: ['./ingredients-step.component.scss']
})
export class IngredientsStepComponent {

  isLoading = false;

  ingredients?: SelectionItem<string>[] = undefined;
  imageFiles: NzUploadFile[] = [];

  constructor(private ingredientIdentificationService: IngredientsIdentificationService, private stepperService: RecipeStepperService) {
    if (this.stepperService.data.ingredients.length > 0) {
      this.ingredients = [...this.stepperService.data.ingredients];
    }
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.imageFiles = this.imageFiles.concat(file);
    return false;
  };

  identifyIngredients(): void {
    this.stepperService.currentStepStatus = RoutedStepStatus.Loading
    this.isLoading = true;

    this.ingredientIdentificationService.identifyIngredientsInImages(this.imageFiles)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(ingredients => {
        const items = ingredients.map(i => ({ label: i, value: i, checked: true }));
        this.updateIngredients(items);
      });
  }

  updateIngredients(selectedIngredients: SelectionItem<string>[]): void {
    this.ingredients = [...selectedIngredients];
    this.stepperService.currentStepStatus = this.ingredients.length > 0 ? RoutedStepStatus.Valid : RoutedStepStatus.Invalid;
    this.stepperService.data.ingredients = [...this.ingredients];
  }
}
