using System.Collections.Generic;

namespace Perry.RecipesScraper.Configurations
{
    public class AllRecipesConfiguration : IScraperConfiguration
    {
        public IEnumerable<string> ValidSiteMapUrls { get; set; }
    }
}
