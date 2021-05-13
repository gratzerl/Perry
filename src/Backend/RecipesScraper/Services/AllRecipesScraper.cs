using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Perry.RecipesScraper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace Perry.RecipesScraper.Services
{
    public class AllRecipesScraper : RecipeScraper
    {
        private const string recipeSitemapBaseUrl = "https://www.allrecipes.com/sitemaps/recipe/";

        public AllRecipesScraper(ILogger<AllRecipesScraper> logger, HtmlWeb web) : base(logger, web)
        {
            sitemapBaseUrl = "https://www.allrecipes.com/sitemap.xml";
        }

        protected override IEnumerable<string> GetRecipeLocsFromSitemap(HtmlNode documentNode)
        {
            return documentNode
                .Descendants()
                .Where(node => node.Name == "loc" && node.InnerText.StartsWith(recipeSitemapBaseUrl))
                .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                .ToList();
        }

        protected override HashSet<string> GetRecipeUrlsInSitemapUrls(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(node => node.Name == "loc")
                    .Select(node => HttpUtility.HtmlDecode(node.InnerText))
                    .ToHashSet();
        }

        protected override async Task<IEnumerable<ScrapedRecipeModel>> ParseRecipesFromUrlsAsync(IEnumerable<string> recipeUrls)
        {
            var recipes = new List<ScrapedRecipeModel>();
            
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
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("margin-0-auto"))
                        .InnerHtml ?? string.Empty;

                    var ingredients = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("ingredients-section"))
                        .GetEscapedInnerTextInDescendentsForClass("ingredients-item-name");

                    var methodSteps = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("instructions-section"))
                        .GetEscapedInnerTextInDescendentsForClass("paragraph");

                    var recipe = new ScrapedRecipeModel
                    {
                        Url = url,
                        Name = WebUtility.HtmlDecode(name),
                        Description = WebUtility.HtmlDecode(description),
                        Ingredients = ingredients,
                        Steps = methodSteps
                    };

                    recipes.Add(recipe);

#if DEBUG
                    if (recipes.Count > 20)
                    {
                        break;
                    }
#endif
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
