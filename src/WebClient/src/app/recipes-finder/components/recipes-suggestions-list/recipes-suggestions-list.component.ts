import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ingredientCategoryOptions } from '../../constants';
import { PagedResponse, RecipeStepperData, RecipeSuggestion } from '../../models';
import { RecipeFinderService } from '../../services';

@Component({
  selector: 'app-recipes-suggestions-list',
  templateUrl: './recipes-suggestions-list.component.html',
  styleUrls: ['./recipes-suggestions-list.component.less']
})
export class RecipesSuggestionsListComponent implements OnInit, OnChanges {
  @Input()
  recipeData!: RecipeStepperData;

  @Input()
  actionButtons!: TemplateRef<any>;

  suggestionResult?: PagedResponse<RecipeSuggestion>;
  isLoading = false;
  pageSize = 14;
  pageNumber = 1;

  constructor(private recipeFinderService: RecipeFinderService) { }

  ngOnInit(): void {
    this.findRecipes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.recipeData && !changes.recipeData.firstChange) {
      this.findRecipes();
    }
  }

  openUrl(url: string): void {
    window.open(url, "_blank");
  }

  findRecipes(): void {
    if (this.recipeData === undefined || this.isLoading) {
      return;
    }

    this.isLoading = true;

    const tags = Object.entries(this.recipeData.preferences)
      .map(([_, value]) => value)
      .reduce((acc, value) => acc.concat(value), [])
      .filter(item => item.checked)
      .map(item => item.item);

    let ingredients: string[] = [];

    let identifiedIngredients: Array<string> = this.recipeData.checkedIdentifiedIngredients.map(i => i.item);
    ingredients.push(identifiedIngredients.join(','));
    const additionalIngredients = this.recipeData.checkedAdditionalIngredients.map(i => i.label ?? '');

    for(let i = 0; i < additionalIngredients.length; i++) {
      const _ = Object.entries(ingredientCategoryOptions)
      .filter(([category, options]) => options.find(o => additionalIngredients[i]== o.labelKey))
      .map(([key, values]) => {
        let option = values.filter(v => v.labelKey == additionalIngredients[i]);
        if (option.length == 0) {
          return '';
        }

        const optionValues: Array<string> = option[0].values;
        ingredients.push(optionValues.join(','));
        return optionValues;
      });
    }

    this.recipeFinderService.findSuggestions(ingredients, tags, this.pageNumber, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        result => {
          this.suggestionResult = { ...result };
        },
        () => this.isLoading = false);
  }
}
