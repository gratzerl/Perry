using System.Collections.Generic;
using System.Linq;
using System.Web;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;

namespace Perry.RecipesScraper.Services
{
    public class AllRecipesScraper : RecipeScraper
    {
        private static readonly IEnumerable<string> siteMapUrls = new List<string> {
            "https://www.allrecipes.com/sitemap.xml",
            "https://www.eatingwell.com/sitemap.xml"
        };

        private readonly IEnumerable<string> recipeBaseUrls = new List<string> {
            "https://www.allrecipes.com/sitemaps/recipe/",
            "https://www.eatingwell.com/sitemaps/recipe/"
        };

        public AllRecipesScraper(ILogger<AllRecipesScraper> logger, HtmlWeb web) 
            : base(logger, web, siteMapUrls, "AllRecipes")
        {
        }

        protected override IEnumerable<string> GetLocsFromSitemap(HtmlNode documentNode)
        {
            return documentNode
                .Descendants()
                .Where(node => node.Name == "loc" && recipeBaseUrls.Any(url => node.InnerText.StartsWith(url)))
                .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                .ToList();
        }

        protected override HashSet<string> GetUrlsInSitemapUrls(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(node => node?.Name == "loc")
                    .Select(node => HttpUtility.HtmlDecode(node.InnerText))
                    .ToHashSet();
        }

        protected override string GetRecipeName(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    ?.FirstOrDefault(n => (n?.HasClass("headline-wrapper")).Value)
                    ?.FirstChild?.InnerHtml ?? string.Empty;
        }

        protected override string GetRecipeDescription(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => (n?.HasClass("recipe-summary")).Value)
                    ?.Descendants()
                    ?.FirstOrDefault(n => (n?.HasClass("margin-0-auto")).Value)
                    ?.InnerHtml ?? string.Empty;
        }

        protected override IEnumerable<string> GetRecipeIngredients(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => (n?.HasClass("ingredients-section")).Value)
                    ?.GetEscapedInnerTextInDescendentsForClass("ingredients-item-name") ?? Enumerable.Empty<string>();
        }
 
        protected override IEnumerable<string> GetRecipeSteps(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => (n?.HasClass("instructions-section")).Value)
                    ?.GetEscapedInnerTextInDescendentsForClass("paragraph") ?? Enumerable.Empty<string>();
        }

        protected override IEnumerable<string> GetRecipeTags(HtmlNode documentNode)
        {
            var karmaScriptTag = documentNode
                .Descendants()
                .FirstOrDefault(n => n?.Id == "karma-loader");

            if (karmaScriptTag == null)
            {
                return Enumerable.Empty<string>();
            }

            var scriptParts = karmaScriptTag.InnerHtml
                .Split('\n')
                .Select(str => str.Trim())
                .Select(str => str.Replace("\"", ""))
                .Select(str => str.Replace("\\", ""))
                .Select(str => str.Replace(",", ""))
                .ToList();

            if (!scriptParts.Any())
            {
                return Enumerable.Empty<string>();
            }

            var tagsStartIdx = scriptParts.FindIndex(str => str.Contains("tags"));

            if (tagsStartIdx == -1)
            {
                return Enumerable.Empty<string>();
            }

            var tagsEndIdx = scriptParts.FindIndex(tagsStartIdx, str => str == "]");
            return scriptParts.GetRange(tagsStartIdx + 1, tagsEndIdx - tagsStartIdx);
        }
    }
}
