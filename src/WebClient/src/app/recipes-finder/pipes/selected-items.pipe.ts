import { Pipe, PipeTransform } from '@angular/core';
import { SelectionItem } from '../models';

@Pipe({
  name: 'selectedItems'
})
export class SelectedItemsPipe implements PipeTransform {

  transform<T>(selectionItems: SelectionItem<T>[], isSelected: boolean = true): SelectionItem<T>[] {
    if (!selectionItems || selectionItems.length === 0) {
      return selectionItems;
    }

    return selectionItems.filter(item => item.checked === isSelected);
  }

}
