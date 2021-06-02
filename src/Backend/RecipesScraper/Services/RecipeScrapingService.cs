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

        public RecipeScrapingService(
            IOptionsMonitor<ScrapingOptions> monitor,
            RecipesContext recipeContext,
            ILogger<RecipeScrapingService> logger,
            IEnumerable<IRecipeScraper> scrapers,
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
            var scrapedRecipes = await RunScrapersAsync();

            var scrapedTags = scrapedRecipes
                .Select(recipe => recipe.Tags)
                .Where(tags => tags != null && tags.Any())
                .SelectMany(tags => tags)
                .ToHashSet();

            var tagEntities = await UpdateTagsAsync(scrapedTags);

            var recipeEntities = await CreateRecipeEntitiesAsync(scrapedRecipes, tagEntities);

            await recipeContext.Recipes.AddRangeAsync(recipeEntities);
            await recipeContext.SaveChangesAsync();

            logger.LogInformation($"{recipeEntities.Count()} recipes saved.");

            hostApplicationLifetime.StopApplication();
            Dispose();
        }

        private async Task<IEnumerable<Recipe>> CreateRecipeEntitiesAsync(IEnumerable<ScrapedRecipeModel> scrapedRecipes, IEnumerable<Tag> tagEntities)
        {
            logger.LogInformation($"Start creating new recipe entities...");

            var alreadyScrapedUrls = await recipeContext.Recipes
                .Select(r => r.Url)
                .AsNoTracking()
                .ToListAsync();

            var recipeEntities = scrapedRecipes
                .Where(r => !alreadyScrapedUrls.Contains(r.Url))
                .Select(r =>
                {
                    var recipe = new Recipe
                    {
                        Id = Guid.NewGuid(),
                        Name = r.Name,
                        Description = r.Description,
                        Ingredients = string.Join('\n', r.Ingredients),
                        Method = string.Join('\n', r.Steps),
                        Url = r.Url
                    };

                    if (r.Tags != null)
                    {
                        foreach (var tag in r.Tags)
                        {
                            var tagEntity = tagEntities.FirstOrDefault(t => t.Text == tag);

                            if (tagEntity != null)
                            {
                                var recipeTag = new RecipeTag
                                {
                                    Recipe = recipe,
                                    RecipeId = recipe.Id,
                                    Tag = tagEntity,
                                    TagId = tagEntity.Id
                                };
                                tagEntity.RecipeTags.Add(recipeTag);
                            }
                        }
                    }

                    return recipe;
                })
                .ToList();

            logger.LogInformation($"Created ${recipeEntities.Count()} new recipes.");

            return recipeEntities;
        }

        private async Task<IEnumerable<ScrapedRecipeModel>> RunScrapersAsync()
        {
            logger.LogInformation("Starting scrapers...");

            var scrapingTasks = new List<Task<IEnumerable<ScrapedRecipeModel>>>();
            foreach (var url in options.UrlsToBeScraped)
            {
                var scraper = scrapers.FirstOrDefault(s => s.CanParseUrl(url)) ?? throw new ArgumentException($"No valid scraper found for {url}");
                scrapingTasks.Add(scraper.ScrapeRecipesAsync(url));
            }

            var taskResult = await Task.WhenAll(scrapingTasks);
            logger.LogInformation("Scrapers finished.");

            return taskResult.SelectMany(recipe => recipe).ToList();
        }

        private async Task<IEnumerable<Tag>> UpdateTagsAsync(HashSet<string> tags)
        {
            logger.LogInformation("Updating tags...");

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

            storedTags.AddRange(newTags);

            logger.LogInformation("Finished updating tags.");
            return await recipeContext.Tags.AsNoTracking().ToListAsync();
        }
    }
}
