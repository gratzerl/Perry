using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Perry.RecipesScraper.Services
{
    public class BbcGoodFoodScraper : RecipeScraper
    {
        private const string recipeBaseUrl = "https://www.bbcgoodfood.com/recipes";

        public BbcGoodFoodScraper(ILogger<BbcGoodFoodScraper> logger, HtmlWeb web) 
            : base(logger, web, new List<string> { "https://www.bbcgoodfood.com/sitemap.xml" })
        {
        }

        protected override IEnumerable<string> GetRecipeLocsFromSitemap(HtmlNode documentNode)
        {
            return documentNode
                .Descendants()
                .Where(n => n.Name == "loc")
                .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                .ToList();
        }

        protected override HashSet<string> GetRecipeUrlsInSitemapUrls(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(node => node.Name == "loc" && !node.InnerText.Contains("collection") && !node.InnerText.Contains("category") && node.InnerText.StartsWith(recipeBaseUrl))
                    .Select(node => HttpUtility.HtmlDecode(node.InnerText))
                    .ToHashSet();
        }

        protected override string GetRecipeName(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("post-header__title"))
                    ?.InnerHtml ?? string.Empty;
        }

        protected override string GetRecipeDescription(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("editor-content"))
                    .FirstChild?.InnerHtml ?? string.Empty;
        }

        protected override IEnumerable<string> GetRecipeIngredients(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("recipe__ingredients"))
                    .GetEscapedInnerTextInDescendentsForClass("list-item");
        }

        protected override IEnumerable<string> GetRecipeSteps(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("recipe__method-steps"))
                    .GetEscapedInnerTextInDescendentsForClass("list-item");
        }
    }
}
