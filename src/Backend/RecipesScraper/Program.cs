using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Perry.Database.Entities;
using Perry.RecipesScraper.Configurations;
using Perry.RecipesScraper.Services;
using System.Linq;

namespace Perry.RecipesScraper
{
    class Program
    {
        static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
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
                        .AddDebug()
                    );

                    var bbcUrls = configuration.GetSection("Urls:BbcGoodFoodUrls").GetChildren().Select(url => url.Value);
                    services.AddSingleton<BbcConfiguration>(new BbcConfiguration { ValidSiteMapUrls = bbcUrls });
                    var allRecipesUrls = configuration.GetSection("Urls:AllRecipesUrls").GetChildren().Select(url => url.Value);
                    services.AddSingleton<AllRecipesConfiguration>(new AllRecipesConfiguration { ValidSiteMapUrls = allRecipesUrls });
                    var allSitemapUrls = configuration.GetSection("Urls:SitemapUrls").GetChildren().Select(url => url.Value);
                    services.AddSingleton<AllConfiguration>(new AllConfiguration { ValidSiteMapUrls = allSitemapUrls });

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
