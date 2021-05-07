using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Perry.Database.Entities;

namespace Perry.RecipesScraper.Services
{
    public class AllRecipesScraper : RecipeScraper
    {
        private const string recipeSitemapBaseUrl = "https://www.allrecipes.com/sitemaps/recipe/";

        public AllRecipesScraper(ILogger<AllRecipesScraper> logger, HtmlWeb web) : base(logger, web)
        {
            sitemapBaseUrl = "https://www.allrecipes.com/sitemap.xml";
        }

        protected override async Task<IEnumerable<string>> GetRecipeUrlsFromSitemapAsync()
        {
            var doc = await web.LoadFromWebAsync(sitemapBaseUrl);

            var sitemapLocs = doc.DocumentNode
                .Descendants()
                .Where(node => node.Name == "loc" && node.InnerText.StartsWith(recipeSitemapBaseUrl))
                .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                .ToList();

            var recipeUrls = new HashSet<string>();

            foreach (var loc in sitemapLocs)
            {
                doc = await web.LoadFromWebAsync(loc);

                var urls = doc.DocumentNode
                    .Descendants()
                    .Where(node => node.Name == "loc")
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

        protected override async Task<IEnumerable<Recipe>> ParseRecipesFromUrlsAsync(IEnumerable<string> recipeUrls)
        {
            var recipes = new List<Recipe>();
            
            foreach(var url in recipeUrls)
            {
                try
                {
                    var doc = await web.LoadFromWebAsync(url);

                    var name = doc.DocumentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("headline-wrapper"))
                    .FirstChild?.InnerHtml ?? string.Empty;

                    var description = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("recipe-summary"))
                        .FirstChild?.InnerHtml ?? string.Empty;

                    var recipe = new Recipe
                    {
                        Id = Guid.NewGuid(),
                        Url = url,
                        Name = WebUtility.HtmlDecode(name),
                        Description = WebUtility.HtmlDecode(description)
                    };

                    var ingredients = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("ingredients-section"))
                        .GetEscapedInnerTextInDescendentsForClass("ingredients-item-name");

                    var methodSteps = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("instructions-section"))
                        .GetEscapedInnerTextInDescendentsForClass("paragraph");

                    recipe.Ingredients = string.Join('\n', ingredients);
                    recipe.Method = string.Join('\n', methodSteps);

                    recipes.Add(recipe);
                } 
                catch (Exception)
                {
                    logger.LogWarning($"Failed to parse recipe from url: ${url}. Skipping it.");
                }
            }

            return recipes;
        }
    }
}
