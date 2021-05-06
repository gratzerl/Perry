using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Perry.Functions.Models;
using Perry.Core.RecipeSuggestions.Services.Interfaces;
using Perry.Core.RecipeSuggestions.Models;
using System.Collections.Generic;
using System.Linq;

namespace Perry.Functions
{
    public class RecipeSuggestionFunction
    {
        private const int SuggestionsPageSize = 20;
        private readonly IRecipeSuggestionService recipeSuggestionService;

        public RecipeSuggestionFunction(IRecipeSuggestionService recipeSuggestionService)
        {
            this.recipeSuggestionService = recipeSuggestionService ?? throw new ArgumentNullException(nameof(recipeSuggestionService));
        }

        [FunctionName("RecipeSuggestionFunction")]
        public async Task<IEnumerable<RecipeSuggestionModel>> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "suggestions")] RecipeSuggestionRequestModel req,
            ILogger log)
        {
            log.LogTrace("Processing suggestion request...");

            var recipes = await recipeSuggestionService.FindSuggestionsAsync(req.Ingredients, req.Tags, req.PageNumber, SuggestionsPageSize);

            log.LogTrace($"Found {recipes.Count()} recipe suggestions.");
            return recipes;
        }
    }
}
