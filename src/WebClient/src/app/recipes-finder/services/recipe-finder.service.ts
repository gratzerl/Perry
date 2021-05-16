import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfig } from 'src/app/core/models';
import { APP_CONFIG } from 'src/app/core/core.module';
import { PagedResponse, RecipeSuggestion, RecipeTag } from '../models';
import { queryStringBuilder } from '../helpers/query-string-builder';
import { RecipeSuggestionRequest } from '../models/recipe-suggestion-request.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeFinderService {
  private readonly route: string = `${this.config.apiBaseUrl}/suggestions`;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private http: HttpClient) { }

  findSuggestions(ingredients: string[], recipeTags: RecipeTag[], pageNumber: number = 1, pageSize: number = 20): Observable<PagedResponse<RecipeSuggestion>> {
    const tags = recipeTags.reduce((acc: string[], curr) => acc.concat(curr.values), []);

    const request = {
      ingredients,
      tags,
      pageNumber,
      pageSize
    };

    return this.http.get<PagedResponse<RecipeSuggestion>>(`${this.route}?${queryStringBuilder(request)}`);
  }
}
