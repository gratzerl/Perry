import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-ingredient-selection',
  templateUrl: './ingredient-selection.component.html',
  styleUrls: ['./ingredient-selection.component.scss']
})
export class IngredientSelectionComponent implements OnChanges {

  @Input()
  ingredients: string[] = [];

  @Output()
  selectionChange: EventEmitter<string[]> = new EventEmitter();

  selectedIngredients: string[] = [];

  ngOnChanges(): void {
    this.selectedIngredients = [...this.ingredients];
  }
}
