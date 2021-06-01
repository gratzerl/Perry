using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Perry.Core.RecipeSuggestions.Mappings;
using Perry.Core.RecipeSuggestions.Models;
using Perry.Core.RecipeSuggestions.Services.Interfaces;
using Perry.Database.Entities;

namespace Perry.Core.RecipeSuggestions.Services
{
    public class RecipeSuggestionService : IRecipeSuggestionService
    {
        private readonly RecipesContext recipesContext;
        private readonly IRecipeQueryBuilder recipeQueryBuilder;

        public RecipeSuggestionService(RecipesContext recipesContext, IRecipeQueryBuilder recipeQueryBuilder)
        {
            this.recipesContext = recipesContext ?? throw new ArgumentException(nameof(recipesContext));
            this.recipeQueryBuilder = recipeQueryBuilder ?? throw new ArgumentException(nameof(recipeQueryBuilder));
        }
        public async Task<PagedResponse<RecipeSuggestionModel>> FindSuggestionsAsync(IEnumerable<string> ingredients, IDictionary<string, IEnumerable<string>> tags, int pageNumber, int pageSize)
        {
            if (ingredients == null || !ingredients.Any())
            {
                throw new ArgumentException("Ingredients must not be empty");
            }

            var recipesQuery = recipeQueryBuilder.BuildRecipeQueryForIngredients(recipesContext.Recipes, ingredients);

            if (tags?.Count() > 0)
            {
                recipesQuery = recipesQuery.AsExpandable();
                foreach (var (category, values) in tags)
                {
                    recipesQuery = recipesQuery
                        .Where(r => r.RecipeTags
                            .Select(rt => rt.Tag.Text)
                            .Any(t => values.Contains(t))
                        );
                }
            }

            var totalCount = await recipesQuery.CountAsync();

            var recipes = await recipesQuery
                .Skip(pageSize * (pageNumber - 1))
                .Take(pageSize)
                .Select(r => RecipeSuggestionMapping.MapToModel.Invoke(r))
                .AsNoTracking()
                .ToListAsync();

            return new PagedResponse<RecipeSuggestionModel>
            {
                CurrentPageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = recipes
            };
        }
    }
}
 