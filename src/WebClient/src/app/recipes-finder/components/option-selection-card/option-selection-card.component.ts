import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecipeTag, SelectionItem } from '../../models';

@Component({
  selector: 'app-option-selection-card',
  templateUrl: './option-selection-card.component.html',
  styleUrls: ['./option-selection-card.component.less']
})
export class OptionSelectionCardComponent {

  @Input()
  heading!: string;

  @Input()
  options!: SelectionItem<RecipeTag>[]

  @Output()
  optionChange: EventEmitter<SelectionItem<RecipeTag>> = new EventEmitter();

}
