using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Perry.Database.Entities;

namespace Perry.RecipesScraper.Services
{
    public class RecipeScrapingService
    {
        private readonly RecipesContext recipeContext;
        private readonly ILogger<RecipeScrapingService> logger;
        private readonly IEnumerable<IRecipeScraper> scrapers;

        public RecipeScrapingService(RecipesContext recipeContext, ILogger<RecipeScrapingService> logger, IEnumerable<IRecipeScraper> scrapers)
        {
            this.recipeContext = recipeContext ?? throw new ArgumentNullException(nameof(recipeContext));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.scrapers = scrapers ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task ScrapeRecipesAsync()
        {
            logger.LogInformation("Loading all already saved recipe urls...");
            var savedRecipes = recipeContext.Recipes
                .Select(r => r.Url)
                .AsNoTracking()
                .ToList();
            logger.LogInformation($"Retrieved {savedRecipes.Count} urls from the db.");

            logger.LogInformation("Starting scrapers...");
            var scrapingTasks = scrapers.Select(s => s.ScrapeRecipesAsync()).ToList();
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
            logger.LogInformation($"{taskResult.Length} recipes saved.");
        }
    }
}
