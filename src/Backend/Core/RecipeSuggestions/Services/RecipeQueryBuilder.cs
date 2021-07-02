using System.Collections.Generic;
using System.Linq;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Perry.Core.RecipeSuggestions.Services.Interfaces;
using Perry.Database.Entities;

namespace Perry.Core.RecipeSuggestions.Services
{
    public class RecipeQueryBuilder : IRecipeQueryBuilder
    {
        public IQueryable<Recipe> BuildRecipeQueryForIngredients(DbSet<Recipe> recipes, IEnumerable<string> ingredients)
        {
            var groupedIngredients = new List<string>();
            foreach(var ingredient in ingredients)
            {
                var cleanedIngredients = ingredient.Split(',').Select(i => $"FORMSOF(INFLECTIONAL, \"{i}\")");
                groupedIngredients.Add(string.Join(" OR ", cleanedIngredients));
            }

            var ingredientsQueryStr = string.Join(" AND ", groupedIngredients);

            return recipes
                .FromSqlInterpolated($@"SELECT Id, Name, Description, Url, Ingredients, Method
                    FROM Recipe AS r 
                    INNER JOIN CONTAINSTABLE (Recipe, Ingredients, {ingredientsQueryStr}) AS KEY_TBL
	                ON r.Id = KEY_TBL.[KEY]
                    WHERE KEY_TBL.RANK > 0
                    ORDER BY KEY_TBL.RANK DESC OFFSET 0 ROWS")
                .AsExpandable()
                .Select(r => r);
        }
    }
}
