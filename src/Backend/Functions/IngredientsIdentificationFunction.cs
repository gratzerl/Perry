using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Perry.Core.IngredientPrediction.Services.Interfaces;

namespace Perry.Functions
{
    public class IngredientsIdentificationFunction
    {
        private readonly IIngredientsIdentificationService ingredientsIdentification;
        private const double MinRequiredProbability = 0.83;

        public IngredientsIdentificationFunction(IIngredientsIdentificationService ingredientsIdentification)
        {
            this.ingredientsIdentification = ingredientsIdentification ?? throw new ArgumentNullException(nameof(ingredientsIdentification));
        }

        [FunctionName("IngredientsIdentificationFunction")]
        public async Task<IEnumerable<string>> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = "ingredient-identification")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Received an ingredient identification request.");
            
            var imageFiles = req.Form.Files;
            var ingredients = new HashSet<string>();

            log.LogInformation($"Processing {imageFiles?.Count()} files.");
            foreach(var file in imageFiles)
            {
                var s = file.OpenReadStream();
                var predictions = await ingredientsIdentification.IdentifyIngredientsAsync(s);
                var filtered = predictions
                    .Where(p => p.Probability >= MinRequiredProbability)
                    .Select(p => p.Name)
                    .ToHashSet();

                ingredients.UnionWith(filtered);
            }

            log.LogInformation($"Finished identifying objects in {imageFiles.Count()} files.");
            return ingredients;
        }
    }
}

