import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { RecipeTag } from 'src/app/recipes-finder/models';

@Component({
  selector: 'app-perference-selection',
  templateUrl: './perference-selection.component.html',
  styleUrls: ['./perference-selection.component.scss']
})
export class PerferenceSelectionComponent implements OnChanges {

  @Input()
  preferences: RecipeTag[] = [];

  @Output()
  selectionChange: EventEmitter<RecipeTag[]> = new EventEmitter();

  selectedPreferences: RecipeTag[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.preferences.isFirstChange) {
      this.selectedPreferences = [...this.preferences];
    }
  }
}
