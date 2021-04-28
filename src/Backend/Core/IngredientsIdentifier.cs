using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction;

namespace Perry.Core
{
    public class IngredientsIdentifier : IIngredientsIdentifier
    {
        private readonly CustomVisionPredictionClient visionClient;
        private readonly CustomVisionProjectConfig projectConfig;

        public IngredientsIdentifier(CustomVisionPredictionClient visionClient, CustomVisionProjectConfig projectConfig)
        {
            this.visionClient = visionClient ?? throw new ArgumentNullException(nameof(visionClient));
            this.projectConfig = projectConfig ?? throw new ArgumentNullException(nameof(projectConfig));
        }

        public async Task<IEnumerable<string>> IdentifyIngredientsAsync(Stream fileStream)
        {
            throw new NotImplementedException();
        }
    }
}
