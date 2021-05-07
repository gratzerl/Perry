using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Perry.RecipesScraper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Perry.RecipesScraper.Services
{
    public abstract class RecipeScraper : IRecipeScraper
    {
        protected string sitemapBaseUrl;
        protected readonly HtmlWeb web;
        protected readonly ILogger<RecipeScraper> logger;

        public RecipeScraper(ILogger<RecipeScraper> logger, HtmlWeb web)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.web = web ?? throw new ArgumentNullException(nameof(web));
        }

        public async Task<IEnumerable<ScrapedRecipeModel>> ScrapeRecipesAsync()
        {
            logger.LogInformation($"Start scraping recipes from {sitemapBaseUrl}...");

            var recipeUrls = await GetRecipeUrlsFromSitemapAsync();
            logger.LogInformation($"Found {recipeUrls.Count()} recipe urls");

            var recipes = await ParseRecipesFromUrlsAsync(recipeUrls);
            logger.LogInformation($"Created {recipes.Count()} recipes");

            return recipes;
        }

        protected abstract Task<IEnumerable<string>> GetRecipeUrlsFromSitemapAsync();

        protected abstract Task<IEnumerable<ScrapedRecipeModel>> ParseRecipesFromUrlsAsync(IEnumerable<string> recipeUrls);
    }
}
