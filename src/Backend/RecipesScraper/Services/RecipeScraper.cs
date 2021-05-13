using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Perry.RecipesScraper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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

        protected abstract IEnumerable<string> GetRecipeLocsFromSitemap(HtmlNode documentNode);

        protected abstract HashSet<string> GetRecipeUrlsInSitemapUrls(HtmlNode documentNode);

        protected abstract string GetRecipeName(HtmlNode documentNode);

        protected abstract string GetRecipeDescription(HtmlNode documentNode);

        protected abstract IEnumerable<string> GetRecipeIngredients(HtmlNode documentNode);

        protected abstract IEnumerable<string> GetRecipeSteps(HtmlNode documentNode);

    }
}
