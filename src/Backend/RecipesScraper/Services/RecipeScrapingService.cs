using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Perry.Database.Entities;
using Perry.RecipesScraper.Configurations;
using Perry.RecipesScraper.Models;

namespace Perry.RecipesScraper.Services
{
    public class RecipeScrapingService : BackgroundService
    {
        private readonly RecipesContext recipeContext;
        private readonly ILogger<RecipeScrapingService> logger;
        private readonly IHostApplicationLifetime hostApplicationLifetime;
        
        private readonly IEnumerable<IRecipeScraper> scrapers;
        private readonly ScrapingOptions options;

        public RecipeScrapingService(IOptionsMonitor<ScrapingOptions> monitor, RecipesContext recipeContext, ILogger<RecipeScrapingService> logger, IEnumerable<IRecipeScraper> scrapers,
            IHostApplicationLifetime hostApplicationLifetime)
        {
            this.recipeContext = recipeContext ?? throw new ArgumentNullException(nameof(recipeContext));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.scrapers = scrapers ?? throw new ArgumentNullException(nameof(logger));
            this.hostApplicationLifetime = hostApplicationLifetime;
            options = monitor?.CurrentValue ?? throw new ArgumentNullException(nameof(monitor));
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
            foreach(var url in options.UrlsToBeScraped)
            {
                var scraper = scrapers.FirstOrDefault(s => s.CanParseUrl(url)) ?? throw new ArgumentException($"No valid scraper found for {url}");
                scrapingTasks.Add(scraper.ScrapeRecipesAsync(url));
            }

            var taskResult = await Task.WhenAll(scrapingTasks).ConfigureAwait(false);
            logger.LogInformation("Scrapers finished.");

            var scrapedTags = taskResult
                .SelectMany(recipe => recipe)
                .Select(recipe => recipe.Tags)
                .Where(tags => tags != null && tags.Any())
                .SelectMany(tags => tags)
                .ToHashSet();

            var tags = await UpdateTagsAsync(scrapedTags);

            var entities = taskResult
                .SelectMany(r => r)
                .Select(r =>
                {
                    var id = Guid.NewGuid();
                    var recipeTags = r.Tags
                        .Select(tag => new RecipeTag
                        {
                            RecipeId = id,
                            TagId = tags.First(t => t.Text == tag).Id
                        })
                        .ToList();

                    var recipe = new Recipe
                    {
                        Id = id,
                        Name = r.Name,
                        Description = r.Description,
                        Ingredients = string.Join('\n', r.Ingredients),
                        Method = string.Join('\n', r.Steps),
                        Url = r.Url
                    };

                    return (recipe, recipeTags);
                })
                .ToList();

            var recipes = entities.Select(tuple => tuple.recipe).ToList();
            var recipeTags = entities.Select(tuple => tuple.recipeTags).SelectMany(rt => rt).ToList();

            int duplicateCount = recipes.RemoveAll(r => savedRecipes.Contains(r.Url));
            logger.LogInformation($"{duplicateCount} recipes are already saved in the db. Skipping these...");

            await recipeContext.Recipes.AddRangeAsync(recipes);
            await recipeContext.RecipeTags.AddRangeAsync(recipeTags);
            await recipeContext.SaveChangesAsync();

            logger.LogInformation($"{entities.Count} recipes saved.");

            hostApplicationLifetime.StopApplication();
            Dispose();
        }

        private async Task<IEnumerable<Tag>> UpdateTagsAsync(HashSet<string> tags)
        {
            var storedTags = await recipeContext.Tags
                .AsNoTracking()
                .Where(tag => tags.Contains(tag.Text))
                .Select(t => t)
                .ToListAsync();

            tags = tags
                .Where(scraped => !storedTags.Any(t => t.Text == scraped))
                .ToHashSet();

            var newTags = tags
                .Select(t => new Tag
                {
                    Id = Guid.NewGuid(),
                    Text = t
                });

            await recipeContext.Tags.AddRangeAsync(newTags);
            await recipeContext.SaveChangesAsync();

            storedTags.AddRange(newTags);
            return storedTags;
        }
    }
}
