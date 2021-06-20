using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Perry.Core.IngredientPrediction.Models;
using Perry.Core.IngredientPrediction.Services;
using Perry.Core.IngredientPrediction.Services.Interfaces;
using Perry.Core.QnAMaker.Models;
using Perry.Core.QnAMaker.Services;
using Perry.Core.QnAMaker.Services.Interfaces;
using Perry.Core.RecipeSuggestions.Services;
using Perry.Core.RecipeSuggestions.Services.Interfaces;
using Perry.Database.Entities;
using System;
using System.Threading.Tasks;

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


            var qnaMakerConfig = new QnAMakerConfig() { KnowledgeDatabase = Environment.GetEnvironmentVariable("QnA_KnowledgeDB") };

            builder.Services
                .AddDbContext<RecipesContext>(options => options.UseSqlServer(dbConnectionString))
                .AddSingleton(CreatePredictionClient(predictionKey, predictionEndpoint))
                .AddSingleton(CreateQnAMakerRuntimeClient(config))
                .AddSingleton(projectConfig)
                .AddSingleton(qnaMakerConfig)
                .AddTransient<IQnAMakerService, QnAMakerService>()
                .AddTransient<IIngredientsIdentificationService, IngredientsIdentificationService>()
                .AddTransient<IRecipeSuggestionService, RecipeSuggestionService>()
                .AddTransient<IRecipeQueryBuilder, RecipeQueryBuilder>();
        }

        private CustomVisionPredictionClient CreatePredictionClient(string predictionKey, string predictionEndpoint)
        {
            return new CustomVisionPredictionClient(new Microsoft.Azure.CognitiveServices.Vision.ComputerVision.ApiKeyServiceClientCredentials(predictionKey))
            {
                Endpoint = predictionEndpoint
            };
        }

        private QnAMakerRuntimeClient CreateQnAMakerRuntimeClient(IConfiguration configuration)
        {
            // use data from cognitive service for connection
            var predictionKey = configuration["QnA_AuthoringKey"];
            var predictionEndpoint = configuration["QnA_AuthoringUrl"];
            var queryingURL = configuration["QnA_QueryUrl"];

            var client = CreateQnAMakerClient(predictionKey, predictionEndpoint);
            var primaryQueryEndpointKey = GetQueryEndpointKey(client).Result;            
            return new QnAMakerRuntimeClient(new EndpointKeyServiceClientCredentials(primaryQueryEndpointKey)) { RuntimeEndpoint = queryingURL };
        }

        private QnAMakerClient CreateQnAMakerClient(string predictionKey, string predictionEndpoint)
        {
            return new QnAMakerClient(new Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker.ApiKeyServiceClientCredentials(predictionKey))
            {
                Endpoint = predictionEndpoint
            };
        }

        private async Task<string> GetQueryEndpointKey(IQnAMakerClient client)
        {
            var endpointKeysObject = await client.EndpointKeys.GetKeysAsync();
            return endpointKeysObject.PrimaryEndpointKey;
        }
    }
}
