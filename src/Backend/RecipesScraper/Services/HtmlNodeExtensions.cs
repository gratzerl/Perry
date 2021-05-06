using System.Net;
using System.Linq;
using System.Collections.Generic;
using HtmlAgilityPack;

namespace Perry.RecipesScraper.Services
{
    public static class HtmlNodeExtensions
    {
        public static IEnumerable<string> GetEscapedInnerTextInDescendentsForClass(this HtmlNode node, string className)
        {
            if (node == null)
            {
                return null;
            }

            return node
                .Descendants()
                .Where(n => n.HasClass(className))
                .Select(n => WebUtility.HtmlDecode(n.InnerText))
                .ToList();
        }
    }
}
