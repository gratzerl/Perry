using System;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Perry.Core.IngredientPrediction;
using Perry.Database.Entities;

[assembly: FunctionsStartup(typeof(Perry.Functions.Startup))]
namespace Perry.Functions
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            if (builder is null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            var predictionKey = Environment.GetEnvironmentVariable("CV_PredictionKey");
            var predictionEndpoint = Environment.GetEnvironmentVariable("CV_Endpoint");
            var dbConnectionString = Environment.GetEnvironmentVariable("ConnectionStrings:DbConnectionString");

            var config = builder.GetContext().Configuration;
            var projectConfig = new CustomVisionProjectConfig
            {
                Id = Guid.Parse(config["CV_ProjectId"]),
                Name = config["CV_PublishedModelName"]
            };

            builder.Services
                .AddDbContext<RecipesContext>(options => options.UseSqlServer(dbConnectionString))
                .AddSingleton(CreatePredictionClient(predictionKey, predictionEndpoint))
                .AddSingleton(projectConfig)
                .AddTransient<IIngredientsIdentificationService, IngredientsIdentificationService>();
        }

        private CustomVisionPredictionClient CreatePredictionClient(string predictionKey, string predictionEndpoint)
        {
            return new CustomVisionPredictionClient(new ApiKeyServiceClientCredentials(predictionKey))
            {
                Endpoint = predictionEndpoint
            };
        }
    }
}
