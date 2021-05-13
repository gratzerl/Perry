import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { IngredientsIdentificationService } from '../../services';

@Component({
  selector: 'app-ingredients-identification',
  templateUrl: './ingredients-identification.component.html',
  styleUrls: ['./ingredients-identification.component.scss']
})
export class IngredientsIdentificationComponent {

  isLoading = false;
  identifiedIngredients?: string[] = undefined;
  selectedIngredients: string[] = [];

  constructor(private ingredientIdentificationService: IngredientsIdentificationService) { }

  identifyIngredients(images: File[]): void {
    this.identifiedIngredients = ['carrot', 'egg', 'zucchini', 'tomato'];
    this.selectedIngredients = [...this.identifiedIngredients];
    //this.isLoading = true;
    // this.ingredientIdentificationService.identifyIngredientsInImages(images)
    //   .pipe(finalize(() => this.isLoading = false))
    //   .subscribe(ingredients => {
    //     this.identifiedIngredients = ingredients.map<SelectedIngredient>(ing => ({ name: ing, isSelected: true }));
    //   });
  }

  updateSelection(selectedIngredients: string[]): void {
    this.selectedIngredients = [...selectedIngredients];
  }

}
