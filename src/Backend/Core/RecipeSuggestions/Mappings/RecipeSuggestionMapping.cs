using System;
using System.Linq.Expressions;
using Perry.Core.RecipeSuggestions.Models;
using Perry.Database.Entities;

namespace Perry.Core.RecipeSuggestions.Mappings
{
    public static class RecipeSuggestionMapping
    {
        public static readonly Expression<Func<Recipe, RecipeSuggestionModel>> MapToModel =
            (entity) => 
                new RecipeSuggestionModel
                {
                    Id = entity.Id,
                    Name = entity.Name,
                    Description = entity.Description,
                    Url = entity.Url
                };
    }
}
