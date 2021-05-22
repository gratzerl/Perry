export interface RecipeSuggestionRequest {
  ingredients: string[],
  tags: string[],
  pageNumber: number,
  pageSize?: number
}
