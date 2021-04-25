using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;
using Perry.Database.Entities;

namespace Perry.RecipesScraper
{
    public class BbcGoodFoodScraper
    {
        private const string sitemapBaseUrl = "https://www.bbcgoodfood.com/sitemap.xml";
        private const string recipeBaseUrl = "https://www.bbcgoodfood.com/recipes";

        private readonly HtmlWeb web = new HtmlWeb();

        public async Task<IEnumerable<Recipe>> ScrapeRecipesAsync()
        {
            var recipeUrls = await GetRecipeUrlsFromSitemapAsync();
            var recipes = await ParseRecipesFromUrlsAsync(recipeUrls);
            return recipes;
        }

        private async Task<IEnumerable<string>> GetRecipeUrlsFromSitemapAsync()
        {
            var doc = await web.LoadFromWebAsync(sitemapBaseUrl);

            var sitemapLocs = doc.DocumentNode
                .Descendants()
                .Where(n => n.Name == "loc")
                .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                .ToList();

            var recipeUrls = new HashSet<string>();

            foreach (var loc in sitemapLocs)
            {
                doc = await web.LoadFromWebAsync(loc);

                var urls = doc.DocumentNode
                    .Descendants()
                    .Where(node => node.Name == "loc" && !node.InnerText.Contains("collection") && node.InnerText.StartsWith(recipeBaseUrl))
                    .Select(node => HttpUtility.HtmlDecode(node.InnerText))
                    .ToHashSet();
                
                recipeUrls.UnionWith(urls);

#if DEBUG
                if (recipeUrls.Count > 20)
                {
                    break;
                }
#endif
            }

            return recipeUrls;
        }

        private async Task<IEnumerable<Recipe>> ParseRecipesFromUrlsAsync(IEnumerable<string> recipeUrls)
        {
            var recipes = new List<Recipe>();
            
            foreach(var url in recipeUrls)
            {
                var doc = await web.LoadFromWebAsync(url);

                var name = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("post-header__title"))
                    ?.InnerHtml ?? string.Empty;

                var description = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("editor-content"))
                    .FirstChild?.InnerHtml;

                var ingredients = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("recipe__ingredients"))
                    .Descendants()
                    .Where(n => n.HasClass("list-item"))
                    .Select(n => Uri.UnescapeDataString(n.InnerText))
                    .ToList();

                var methodSteps = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("recipe__method-steps"))
                    .Descendants()
                    .Where(n => n.HasClass("list-item"))
                    .Select(n => Uri.UnescapeDataString(n.InnerText))
                    .ToList();

                var recipe = new Recipe
                {
                    Id = Guid.NewGuid(),
                    Url = url,
                    Name = Uri.UnescapeDataString(name),
                    Description = Uri.UnescapeDataString(description),
                    Ingredients = string.Join('\n', ingredients),
                    Method = string.Join('\n', methodSteps)
                };

                recipes.Add(recipe);
            }

            return recipes;
        }
    }
}
