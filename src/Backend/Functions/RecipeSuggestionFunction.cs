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
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "suggestions")] HttpRequest req,
            ILogger log)
        {
            log.LogTrace("Processing suggestion request...");

            // azure functions fails to deserialize request model from the querystring properly
            // other workaround: https://stackoverflow.com/questions/64388505/azure-function-c-sharp-pass-liststring-as-an-argument-over-http-trigger-get

            var ingredients = req.ReadIngredientsFromQuery();

            if (!ingredients.Any())
            {
                return new BadRequestObjectResult("Ingredients must not be empty");
            }

            var tags = req.ReadTagsFromQuery();

            if (!int.TryParse(req.Query["pageNumber"], out int pageNumber))
            {
                pageNumber = 1;
            }

            if (pageNumber <= 0)
            {
                return new BadRequestObjectResult("The page number must be greater than 0");
            }

            if (!int.TryParse(req.Query["pageSize"], out int pageSize))
            {
                pageSize = SuggestionsPageSize;
            }

            if (pageSize <= 0)
            {
                return new BadRequestObjectResult("The page size must be greater than 0");
            }

            var response = await recipeSuggestionService.FindSuggestionsAsync(ingredients, tags, pageNumber, pageSize);

            log.LogTrace($"Found {response.TotalCount} recipes in total. Page: {response.CurrentPageNumber}/{response.TotalPages}");

            return new OkObjectResult(response);
        }
    }
}
