using System;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
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

            var cogServiceSubKey = Environment.GetEnvironmentVariable("ComputerVisionSubscriptionKey");
            var cogServicesEndpoint = Environment.GetEnvironmentVariable("ComputerVisionEndpoint");
            var dbConnectionString = Environment.GetEnvironmentVariable("ConnectionStrings:DbConnectionString");

            builder.Services
                .AddDbContext<RecipesContext>(options => options.UseSqlServer(dbConnectionString))
                .AddSingleton(CreateComputerVisionClient(cogServiceSubKey, cogServicesEndpoint))
                .AddTransient<IIngredientsIdentifier, IngredientsIdentifier>();
        }

        private ComputerVisionClient CreateComputerVisionClient(string subscriptionKey, string endpoint)
        {
            

            return new ComputerVisionClient(new ApiKeyServiceClientCredentials(subscriptionKey))
            {
                Endpoint = endpoint
            };
        }
    }
}
