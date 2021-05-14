import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IngredientsIdentificationService, RecipeStepperDataService } from '../../services';

@Component({
  selector: 'app-ingredients-step',
  templateUrl: './ingredients-step.component.html',
  styleUrls: ['./ingredients-step.component.scss']
})
export class IngredientsStepComponent {

  isLoading = false;
  identifiedIngredients?: string[] = undefined;
  selectedIngredients: string[] = [];

  constructor(private ingredientIdentificationService: IngredientsIdentificationService, private recipeDataService: RecipeStepperDataService) { }

  identifyIngredients(images: File[]): void {
    this.identifiedIngredients = ['carrot', 'egg', 'zucchini', 'tomato'];
    this.selectedIngredients = [...this.identifiedIngredients];
    // this.isLoading = true;

    // this.ingredientIdentificationService.identifyIngredientsInImages(images)
    //   .pipe(finalize(() => this.isLoading = false))
    //   .subscribe(ingredients => {
    //     this.updateSelection(ingredients);
    //   });
  }

  updateSelection(selectedIngredients: string[]): void {
    this.selectedIngredients = [...selectedIngredients];
    this.recipeDataService.recipeStepperData.ingredients = [...this.selectedIngredients];
  }
}
