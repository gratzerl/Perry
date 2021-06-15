using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Perry.Database.Entities;
using Perry.RecipesScraper.Configurations;
using Perry.RecipesScraper.Services;

namespace Perry.RecipesScraper
{
    class Program
    {
        static void Main(string[] args)
        {
            CreateHostBuilder(args)
                .Build()
                .Run();
        }

        static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostBuilderContext, services) =>
                {
                    var configuration = hostBuilderContext.Configuration;
                    var dbConnection = configuration.GetConnectionString("ApplicationDbConnection");

                    services.AddDbContext<RecipesContext>(options => options.UseSqlServer(dbConnection));
                    
                    services.AddLogging(_ => _
                        .AddConsole()
                        .AddDebug());

                    services.Configure<ScrapingOptions>(configuration);

                    services
                        .AddTransient<IRecipeScraper, BbcGoodFoodScraper>()
                        .AddTransient<IRecipeScraper, AllRecipesScraper>()
                        .AddTransient<IHowToScraper, HowToScraper>()
                        .AddTransient<HtmlWeb>()
                        .AddHostedService<RecipeScrapingService>()
                        .AddHostedService<HowToScrapingService>();
                });
    }
}
