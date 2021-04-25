using System;
using System.Threading.Tasks;

namespace Perry.RecipesScraper
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var s = new BbcGoodFoodScraper();
            var recipes = await s.ScrapeRecipesAsync();
            Console.WriteLine();
        }
    }
}
