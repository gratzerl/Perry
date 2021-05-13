using System.Collections.Generic;

namespace Perry.RecipesScraper.Models
{
    public class ScrapedRecipeModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public IEnumerable<string> Ingredients { get; set; }
        public IEnumerable<string> Steps { get; set; }
        public IEnumerable<string> Tags { get; set; }
    }
}
