using System.Collections.Generic;

namespace Perry.RecipesScraper.Configurations
{
    public class AllConfiguration : IScraperConfiguration
    {
        public IEnumerable<string> ValidSiteMapUrls { get; set; }
    }
}
