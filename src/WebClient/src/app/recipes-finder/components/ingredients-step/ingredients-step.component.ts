import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { RoutedStepStatus } from '../../models';
import { IngredientsIdentificationService, RecipeStepperService } from '../../services';

@Component({
  selector: 'app-ingredients-step',
  templateUrl: './ingredients-step.component.html',
  styleUrls: ['./ingredients-step.component.scss']
})
export class IngredientsStepComponent implements OnInit {

  isLoading = false;
  identifiedIngredients?: string[] = undefined;
  selectedIngredients: string[] = [];

  constructor(private ingredientIdentificationService: IngredientsIdentificationService, private stepperService: RecipeStepperService) { }

  ngOnInit(): void {
    this.selectedIngredients = [... this.stepperService.data.ingredients];
  }

  identifyIngredients(images: File[]): void {
    this.stepperService.currentStepStatus = RoutedStepStatus.Loading
    this.isLoading = true;

    this.ingredientIdentificationService.identifyIngredientsInImages(images)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(ingredients => {
        this.identifiedIngredients = ingredients;
        this.updateSelection(ingredients);
      });
  }

  updateSelection(selectedIngredients: string[]): void {
    this.selectedIngredients = [...selectedIngredients];
    this.stepperService.currentStepStatus = this.selectedIngredients.length > 0 ? RoutedStepStatus.Valid : RoutedStepStatus.Invalid;
    this.stepperService.data.ingredients = [...this.selectedIngredients];
  }
}
