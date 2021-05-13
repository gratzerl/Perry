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
    public class BbcGoodFoodScraper : RecipeScraper
    {
        private const string recipeBaseUrl = "https://www.bbcgoodfood.com/recipes";

        public BbcGoodFoodScraper(ILogger<BbcGoodFoodScraper> logger, HtmlWeb web) : base(logger, web)
        {
            sitemapBaseUrl = "https://www.bbcgoodfood.com/sitemap.xml";
        }

        protected override IEnumerable<string> GetRecipeLocsFromSitemap(HtmlNode documentNode)
        {
            return documentNode
                .Descendants()
                .Where(n => n.Name == "loc")
                .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                .ToList();
        }

        protected override HashSet<string> GetRecipeUrlsInSitemapUrls(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(node => node.Name == "loc" && !node.InnerText.Contains("collection") && !node.InnerText.Contains("category") && node.InnerText.StartsWith(recipeBaseUrl))
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
                    .FirstOrDefault(n => n.HasClass("post-header__title"))
                    ?.InnerHtml ?? string.Empty;

                    var description = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("editor-content"))
                        .FirstChild?.InnerHtml ?? string.Empty;
                                       
                    var ingredients = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("recipe__ingredients"))
                        .GetEscapedInnerTextInDescendentsForClass("list-item");

                    var methodSteps = doc.DocumentNode
                        .Descendants()
                        .FirstOrDefault(n => n.HasClass("recipe__method-steps"))
                        .GetEscapedInnerTextInDescendentsForClass("list-item");

                    var recipe = new ScrapedRecipeModel
                    {
                        Url = url,
                        Name = WebUtility.HtmlDecode(name),
                        Description = WebUtility.HtmlDecode(description),
                        Ingredients = ingredients,
                        Steps = methodSteps
                    };

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
