using Perry.RecipesScraper.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Perry.RecipesScraper.Services
{
    public interface IRecipeScraper
    {
        public Task<IEnumerable<ScrapedRecipeModel>> ScrapeRecipesAsync();
    }
}
