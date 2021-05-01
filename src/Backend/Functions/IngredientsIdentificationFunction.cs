using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Perry.Core.IngredientPrediction;

namespace Perry.Functions
{
    public class IngredientsIdentificationFunction
    {
        private readonly IIngredientsIdentificationService ingredientsIdentification;

        public IngredientsIdentificationFunction(IIngredientsIdentificationService ingredientsIdentification)
        {
            this.ingredientsIdentification = ingredientsIdentification ?? throw new ArgumentNullException(nameof(ingredientsIdentification));
        }

        [FunctionName("IngredientsIdentificationFunction")]
        public async Task<IEnumerable<IEnumerable<IngredientPrediction>>> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("Received an ingredient identification request.");
            
            var imageFiles = req.Form.Files;
            var result = new List<IEnumerable<IngredientPrediction>>();

            log.LogInformation($"Processing {imageFiles.Count()} files.");
            foreach(var file in imageFiles)
            {
                var s = file.OpenReadStream();
                var predictions = await ingredientsIdentification.IdentifyIngredientsAsync(s);
                var filtered = predictions
                    .Where(p => p.Probability >= 0.83)
                    .GroupBy(p => p.Name)
                    .Select(grp => grp.First())
                    .ToList();

                result.Add(filtered);
            }

            log.LogInformation($"Finished identifying objects in {imageFiles.Count()} files.");
            return result;
        }
    }
}

