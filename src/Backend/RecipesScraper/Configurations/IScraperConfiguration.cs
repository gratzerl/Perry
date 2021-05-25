using System.Collections.Generic;

namespace Perry.RecipesScraper.Configurations
{
    public interface IScraperConfiguration
    {
        public IEnumerable<string> ValidSiteMapUrls { get; set; }
    }
}
