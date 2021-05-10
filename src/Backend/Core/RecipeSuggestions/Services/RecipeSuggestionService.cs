﻿using System;
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
        public async Task<IEnumerable<RecipeSuggestionModel>> FindSuggestionsAsync(IEnumerable<string> ingredients, IEnumerable<string> tags, int pageNumber, int pageSize)
        {
            if (ingredients == null || !ingredients.Any())
            {
                throw new ArgumentException("Ingredients must not be empty");
            }

            var recipesQuery = recipeQueryBuilder.BuildRecipeQueryForIngredients(recipesContext.Recipes, ingredients);

            if (tags?.Count() > 0)
            {
                recipesQuery = recipesQuery
                    .AsExpandable()
                    .Where(r => r.RecipeTags.Select(rt => rt.Tag.Text).Where(t => tags.Contains(t)).Any());
            }

            return await recipesQuery
                .Skip(pageSize * (pageNumber - 1))
                .Take(pageSize)
                .Select(r => RecipeSuggestionMapping.MapToModel.Invoke(r))
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
 