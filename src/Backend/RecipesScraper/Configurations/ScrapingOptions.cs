using System.Collections.Generic;

namespace Perry.RecipesScraper.Configurations
{
    public class ScrapingOptions
    {
        public ScrapingOptions() { }

        public IEnumerable<string> UrlsToBeScraped { get; set; }
    }
}
