using System.Collections.Generic;
using System.Threading.Tasks;
using Perry.Database.Entities;

namespace Perry.RecipesScraper.Services
{
    public interface IRecipeScraper
    {
        public Task<IEnumerable<Recipe>> ScrapeRecipesAsync();
    }
}
