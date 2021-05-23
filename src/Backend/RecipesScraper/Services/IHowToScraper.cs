using System.Collections.Generic;
using System.Threading.Tasks;

namespace Perry.RecipesScraper.Services
{
    public interface IHowToScraper
    {
        public Task<Dictionary<string, string>> ScrapeHowTosAsync();
    }
}
