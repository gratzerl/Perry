using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Perry.Database.Entities;

namespace Perry.RecipesScraper.Services
{
    public class BbcGoodFoodScraper : IRecipeScraper
    {
        private const string sitemapBaseUrl = "https://www.bbcgoodfood.com/sitemap.xml";
        private const string recipeBaseUrl = "https://www.bbcgoodfood.com/recipes";

        private readonly HtmlWeb web;
        private readonly ILogger<BbcGoodFoodScraper> logger;

        public BbcGoodFoodScraper(ILogger<BbcGoodFoodScraper> logger)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            web = new HtmlWeb();
        }

        public async Task<IEnumerable<Recipe>> ScrapeRecipesAsync()
        {
            logger.LogInformation($"Start scraping recipes from {sitemapBaseUrl}...");
            
            var recipeUrls = await GetRecipeUrlsFromSitemapAsync();
            logger.LogInformation($"Found {recipeUrls.Count()} recipe urls");

            var recipes = await ParseRecipesFromUrlsAsync(recipeUrls);
            logger.LogInformation($"Created {recipes.Count()} recipes");

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
                    ?.InnerText ?? string.Empty;

                var description = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("editor-content"))
                    .FirstChild?.InnerText ?? string.Empty;

                var recipe = new Recipe
                {
                    Id = Guid.NewGuid(),
                    Url = url,
                    Name = Uri.UnescapeDataString(name),
                    Description = Uri.UnescapeDataString(description)
                };

                var ingredients = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("recipe__ingredients"))
                    .Descendants()
                    .Where(n => n.HasClass("list-item"))
                    .Select(n => new Ingredient {
                        Id = Guid.NewGuid(),
                        Text = Uri.UnescapeDataString(n.InnerText),
                        Recipe = recipe
                    })
                    .ToList();

                var methodSteps = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("recipe__method-steps"))
                    .Descendants()
                    .Where(n => n.HasClass("list-item"))
                    .Select((n, idx) => new MethodStep {
                        Id = Guid.NewGuid(),
                        Text = Uri.UnescapeDataString(n.InnerText),
                        Number = idx + 1,
                        Recipe = recipe
                    })
                    .ToList();
                
                recipe.Ingredients = ingredients;
                recipe.MethodSteps = methodSteps;

                recipes.Add(recipe);
            }

            return recipes;
        }
    }
}
