import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
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
  pageSize = 2;

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

  findRecipes(pageNumber: number = 1): void {
    if (this.recipeData === undefined || this.isLoading) {
      return;
    }

    this.isLoading = true;

    const tags = Object.entries(this.recipeData.preferences)
      .map(([_, value]) => value)
      .reduce((acc, value) => acc.concat(value), [])
      .filter(item => item.checked)
      .map(item => item.item);

    const ingredients = this.recipeData.additionalIngredients
      .filter(item => item.checked)
      .map(item => item.item);

    this.recipeFinderService.findSuggestions(ingredients, tags, pageNumber, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(
        result => {
          this.suggestionResult = result;
        },
        err => {
          this.isLoading = false;
        });
  }

}
