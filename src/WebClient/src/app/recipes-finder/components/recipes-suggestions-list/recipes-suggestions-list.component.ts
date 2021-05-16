import { Component, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PagedResponse, RecipeStepperData, RecipeSuggestion } from '../../models';
import { RecipeFinderService } from '../../services';

@Component({
  selector: 'app-recipes-suggestions-list',
  templateUrl: './recipes-suggestions-list.component.html',
  styleUrls: ['./recipes-suggestions-list.component.scss']
})
export class RecipesSuggestionsListComponent {
  @Input()
  recipeData?: RecipeStepperData;

  suggestionResult?: PagedResponse<RecipeSuggestion>;
  isLoading = false;
  pageSize = 1;

  constructor(private recipeFinderService: RecipeFinderService) { }

  openUrl(url: string): void {
    window.open(url, "_blank");
  }

  findRecipes(pageIndex: number = 0): void {
    if (this.recipeData === undefined) {
      return;
    }

    this.isLoading = true;

    const tags = Object.entries(this.recipeData.preferences)
      .map(([_, value]) => value)
      .reduce((acc, value) => acc.concat(value), []);

    const pageNumber = pageIndex + 1;

    this.recipeFinderService.findSuggestions(this.recipeData.ingredients, tags, pageNumber, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(result => {
        this.suggestionResult = result;
      });
  }

}
