using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction;

namespace Perry.Core.IngredientPrediction
{
    public class IngredientsIdentificationService : IIngredientsIdentificationService
    {
        private readonly CustomVisionPredictionClient predictionClient;
        private readonly CustomVisionProjectConfig projectConfig;

        public IngredientsIdentificationService(CustomVisionPredictionClient predictionClient, CustomVisionProjectConfig projectConfig)
        {
            this.predictionClient = predictionClient ?? throw new ArgumentNullException(nameof(predictionClient));
            this.projectConfig = projectConfig ?? throw new ArgumentNullException(nameof(projectConfig));
        }

        public async Task<IEnumerable<IngredientPrediction>> IdentifyIngredientsAsync(Stream fileStream)
        {
            var result = await predictionClient.DetectImageAsync(projectConfig.Id, projectConfig.Name, fileStream);

            return result.Predictions
                .Select(p => new IngredientPrediction
                {
                    Name = p.TagName,
                    Probability = p.Probability
                })
                .ToList();
        }
    }
}
