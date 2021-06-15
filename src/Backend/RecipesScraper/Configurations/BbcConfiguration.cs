using System.Collections.Generic;

namespace Perry.RecipesScraper.Configurations
{
    public class BbcConfiguration : IScraperConfiguration
    {
        public IEnumerable<string> ValidSiteMapUrls { get; set; }
    }
}
