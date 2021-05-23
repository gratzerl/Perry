using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Perry.Database.Entities;
using Perry.RecipesScraper.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Perry.RecipesScraper.Services
{
    public class RecipeScrapingService : BackgroundService
    {
        private readonly RecipesContext recipeContext;
        private readonly ILogger<RecipeScrapingService> logger;
        private readonly IEnumerable<IRecipeScraper> scrapers;

        private readonly List<string> sitemapUrls;

        public RecipeScrapingService(IConfiguration configuration, RecipesContext recipeContext, ILogger<RecipeScrapingService> logger, IEnumerable<IRecipeScraper> scrapers)
        {
            sitemapUrls = configuration.GetSection("Urls:SitemapUrls").GetChildren().Select(url => url.Value).ToList();
            this.recipeContext = recipeContext ?? throw new ArgumentNullException(nameof(recipeContext));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.scrapers = scrapers ?? throw new ArgumentNullException(nameof(logger));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            logger.LogInformation("Loading all already saved recipe urls...");
            var savedRecipes = recipeContext.Recipes
                .Select(r => r.Url)
                .AsNoTracking()
                .ToList();
            logger.LogInformation($"Retrieved {savedRecipes.Count} urls from the db.");

            logger.LogInformation("Starting scrapers...");

            var scrapingTasks = new List<Task<IEnumerable<ScrapedRecipeModel>>>();
            foreach(var url in sitemapUrls)
            {
                var scraper = scrapers.FirstOrDefault(s => s.CanParseUrl(url)) ?? throw new ArgumentException($"No valid scraper found for {url}");
                scrapingTasks.Add(scraper.ScrapeRecipesAsync(url));
            }

            var taskResult = await Task.WhenAll(scrapingTasks).ConfigureAwait(false);
            logger.LogInformation("Scrapers finished.");

            var scrapedRecipes = taskResult.SelectMany(r => r).Select(r => 
                new Recipe
                {
                    Id = Guid.NewGuid(),
                    Name = r.Name,
                    Description = r.Description,
                    Ingredients = string.Join('\n', r.Ingredients),
                    Method = string.Join('\n', r.Steps),
                    Url = r.Url
                }
            ).ToList();

            int duplicateCount = scrapedRecipes.RemoveAll(r => savedRecipes.Contains(r.Url));
            logger.LogInformation($"{duplicateCount} recipes are already saved in the db. Skipping these...");

            await recipeContext.Recipes.AddRangeAsync(scrapedRecipes);
            await recipeContext.SaveChangesAsync();
            logger.LogInformation($"{scrapedRecipes.Count} recipes saved.");

            this.Dispose();
        }
    }
}
