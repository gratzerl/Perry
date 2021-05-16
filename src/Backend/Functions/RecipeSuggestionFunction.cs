using System;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Perry.Core.RecipeSuggestions.Services.Interfaces;
using Perry.Core.RecipeSuggestions.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Perry.Functions.Models;
using System.Text.Json;
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
        public async Task<PagedResponse<RecipeSuggestionModel>> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "suggestions")] HttpRequest req,
            ILogger log)
        {
            log.LogTrace("Processing suggestion request...");

            // azure functions fails to deserialize request model properly
            // other workaround: https://stackoverflow.com/questions/64388505/azure-function-c-sharp-pass-liststring-as-an-argument-over-http-trigger-get

            var ingredients = req.Query
                .Where(entry => entry.Key.ToLower().Contains("ingredient"))
                .Select(entry => entry.Value.ToString())
                .ToList();

            var tags = req.Query
                .Where(entry => entry.Key.ToLower().Contains("tag"))
                .Select(entry => entry.Value.ToString())
                .ToList();

            if (!int.TryParse(req.Query["pageNumber"], out int pageNumber))
            {
                pageNumber = 1;
            }
            
            if (!int.TryParse(req.Query["pageSize"], out int pageSize))
            {
                pageSize = SuggestionsPageSize;
            }

            var response = await recipeSuggestionService.FindSuggestionsAsync(ingredients, tags, pageNumber, pageSize);

            log.LogTrace($"Found {response.TotalCount} recipes in total. Page: {response.CurrentPageNumber}/{response.TotalPages}");

            return response;
        }
    }
}
