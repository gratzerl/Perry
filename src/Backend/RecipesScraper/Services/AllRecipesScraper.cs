using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using Perry.RecipesScraper.Configurations;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Perry.RecipesScraper.Services
{
    public class AllRecipesScraper : RecipeScraper
    {
        private readonly IList<string> recipeSitemapBaseUrls = new List<string> {
            "https://www.allrecipes.com/sitemaps/recipe/",
            "https://www.eatingwell.com/sitemaps/recipe/"
        };

        public AllRecipesScraper(AllRecipesConfiguration configuration, ILogger<AllRecipesScraper> logger, HtmlWeb web) 
            : base(logger, web)
        {
            validSitemapUrls = configuration.ValidSiteMapUrls.ToList();
        }

        protected override IEnumerable<string> GetLocsFromSitemap(HtmlNode documentNode)
        {
            return documentNode
                .Descendants()
                .Where(node => node.Name == "loc" && recipeSitemapBaseUrls.Any(url => node.InnerText.StartsWith(url)))
                .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                .ToList();
        }

        protected override HashSet<string> GetUrlsInSitemapUrls(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(node => node.Name == "loc")
                    .Select(node => HttpUtility.HtmlDecode(node.InnerText))
                    .ToHashSet();
        }

        protected override string GetRecipeName(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("headline-wrapper"))
                    .FirstChild?.InnerHtml ?? string.Empty;
        }

        protected override string GetRecipeDescription(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("recipe-summary"))
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("margin-0-auto"))
                    .InnerHtml ?? string.Empty;
        }

        protected override IEnumerable<string> GetRecipeIngredients(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("ingredients-section"))
                    .GetEscapedInnerTextInDescendentsForClass("ingredients-item-name");
        }
 
        protected override IEnumerable<string> GetRecipeSteps(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("instructions-section"))
                    .GetEscapedInnerTextInDescendentsForClass("paragraph");
        }
    }
}
