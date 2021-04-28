using System;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Perry.Core;
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

            var cogServiceSubKey = Environment.GetEnvironmentVariable("CustomVisionKey");
            var cogServicesEndpoint = Environment.GetEnvironmentVariable("CustomVisionEndpoint");
            var dbConnectionString = Environment.GetEnvironmentVariable("ConnectionStrings:DbConnectionString");

            var config = builder.GetContext().Configuration;
            var projectConfig = new CustomVisionProjectConfig
            {
                Id = Guid.Parse(config["CustomVisionProjectId"]),
                Name = config["CustomVisionProjectName"]
            };

            builder.Services
                .AddDbContext<RecipesContext>(options => options.UseSqlServer(dbConnectionString))
                .AddSingleton(CreateCustomVisionClient(cogServiceSubKey, cogServicesEndpoint))
                .AddSingleton(projectConfig)
                .AddTransient<IIngredientsIdentifier, IngredientsIdentifier>();
        }

        private CustomVisionPredictionClient CreateCustomVisionClient(string subscriptionKey, string endpoint)
        {
            return new CustomVisionPredictionClient(new ApiKeyServiceClientCredentials(subscriptionKey))
            {
                Endpoint = endpoint
            };
        }
    }
}
