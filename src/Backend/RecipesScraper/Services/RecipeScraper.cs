using HtmlAgilityPack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Perry.RecipesScraper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Perry.RecipesScraper.Services
{
    public abstract class RecipeScraper : GenericScraper, IRecipeScraper
    {
       
        protected readonly ILogger<RecipeScraper> logger;

        protected readonly IList<string> validSitemapUrls;

        public RecipeScraper(IConfiguration configuration, ILogger<RecipeScraper> logger, HtmlWeb web, string validSitemapUrlPath) : base(web)
        {
            this.validSitemapUrls = configuration.GetSection(validSitemapUrlPath).GetChildren().Select(url => url.Value).ToList();
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<IEnumerable<ScrapedRecipeModel>> ScrapeRecipesAsync(string sitemapBaseUrl)
        {
            logger.LogInformation($"Start scraping recipes from {sitemapBaseUrl}...");

            var recipeUrls = await GetUrlsFromSitemapAsync(sitemapBaseUrl);
            logger.LogInformation($"Found {recipeUrls.Count()} recipe urls (on basis of {sitemapBaseUrl})");

            var recipes = await ParseRecipesFromUrlsAsync(recipeUrls);
            logger.LogInformation($"Created {recipes.Count()} recipes (on basis of {sitemapBaseUrl})");

            return recipes;
        }

        protected async Task<IEnumerable<ScrapedRecipeModel>> ParseRecipesFromUrlsAsync(IEnumerable<string> recipeUrls)
        {
            var recipes = new List<ScrapedRecipeModel>();

            foreach (var url in recipeUrls)
            {
                try
                {
                    var doc = await web.LoadFromWebAsync(url);

                    var name = GetRecipeName(doc.DocumentNode);
                    var description = GetRecipeDescription(doc.DocumentNode);
                    var ingredients = GetRecipeIngredients(doc.DocumentNode);
                    var methodSteps = GetRecipeSteps(doc.DocumentNode);

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
                    if (recipes.Count > 10)
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

        public bool CanParseUrl(string url)
        {
            return validSitemapUrls.Contains(url);
        }

        protected abstract string GetRecipeName(HtmlNode documentNode);

        protected abstract string GetRecipeDescription(HtmlNode documentNode);

        protected abstract IEnumerable<string> GetRecipeIngredients(HtmlNode documentNode);

        protected abstract IEnumerable<string> GetRecipeSteps(HtmlNode documentNode);
    }
}
