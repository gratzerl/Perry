using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Perry.Database.Entities;

namespace Perry.Core.RecipeSuggestions.Services.Interfaces
{
    public interface IRecipeQueryBuilder
    {
        public IQueryable<Recipe> BuildRecipeQueryForIngredients(DbSet<Recipe> recipes, IEnumerable<string> ingredients);
    }
}
