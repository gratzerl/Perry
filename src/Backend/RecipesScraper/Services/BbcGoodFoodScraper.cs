using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Perry.RecipesScraper.Services
{
    public class BbcGoodFoodScraper : RecipeScraper
    {
        private static readonly string bbcBaseUrl = "https://www.bbcgoodfood.com";

        private static readonly IEnumerable<string> siteMapUrls = new List<string> {
            $"{bbcBaseUrl}/sitemap.xml"
        };

        private readonly string recipeBaseUrl = $"{bbcBaseUrl}/recipes";

        public BbcGoodFoodScraper(ILogger<BbcGoodFoodScraper> logger, HtmlWeb web) 
            : base(logger, web, siteMapUrls, "BBC")
        {
        }

        protected override HashSet<string> GetUrlsInSitemapUrls(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(node => node?.Name == "loc" && 
                        !(node?.InnerText.Contains("collection")).Value && 
                        !(node?.InnerText.Contains("category")).Value &&
                        (node?.InnerText.StartsWith(recipeBaseUrl)).Value
                    )
                    .Select(node => HttpUtility.HtmlDecode(node?.InnerText))
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
                    .FirstOrDefault(n => (n?.HasClass("editor-content")).Value)
                    ?.FirstChild?.InnerHtml ?? string.Empty;
        }

        protected override IEnumerable<string> GetRecipeIngredients(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => (n?.HasClass("recipe__ingredients")).Value)
                    ?.GetEscapedInnerTextInDescendentsForClass("list-item") ?? Enumerable.Empty<string>();
        }

        protected override IEnumerable<string> GetRecipeSteps(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => (n?.HasClass("recipe__method-steps")).Value)
                    ?.GetEscapedInnerTextInDescendentsForClass("list-item") ?? Enumerable.Empty<string>();
        }

        protected override IEnumerable<string> GetRecipeTags(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => (n?.HasClass("terms-icons-list")).Value)
                    ?.GetEscapedInnerTextInDescendentsForClass("terms-icons-list__text") ?? Enumerable.Empty<string>();
        }
    }
}
