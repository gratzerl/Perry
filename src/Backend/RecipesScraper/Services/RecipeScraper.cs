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

        protected async Task<IEnumerable<string>> GetRecipeUrlsFromSitemapAsync()
        {
            var doc = await web.LoadFromWebAsync(sitemapBaseUrl);

            var sitemapLocs = GetRecipeLocsFromSitemap(doc.DocumentNode);

            var recipeUrls = new HashSet<string>();

            foreach (var loc in sitemapLocs)
            {
                doc = await web.LoadFromWebAsync(loc);

                var urls = GetRecipeUrlsInSitemapUrls(doc.DocumentNode);

                recipeUrls.UnionWith(urls);
            }

            return recipeUrls;
        }

        protected abstract IEnumerable<string> GetRecipeLocsFromSitemap(HtmlNode documentNode);

        protected abstract HashSet<string> GetRecipeUrlsInSitemapUrls(HtmlNode documentNode);

        protected abstract Task<IEnumerable<ScrapedRecipeModel>> ParseRecipesFromUrlsAsync(IEnumerable<string> recipeUrls);
    }
}
