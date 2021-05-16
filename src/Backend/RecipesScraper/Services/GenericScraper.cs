using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Perry.RecipesScraper.Services
{
    public abstract class GenericScraper
    {
        protected string sitemapBaseUrl;
        protected readonly HtmlWeb web;

        public GenericScraper(HtmlWeb web)
        {
            this.web = web ?? throw new ArgumentNullException(nameof(web));
        }

        protected async Task<IEnumerable<string>> GetUrlsFromSitemapAsync()
        {
            var doc = await web.LoadFromWebAsync(sitemapBaseUrl);

            var sitemapLocs = GetLocsFromSitemap(doc.DocumentNode);

            var recipeUrls = new HashSet<string>();

            foreach (var loc in sitemapLocs)
            {
                doc = await web.LoadFromWebAsync(loc);

                var urls = GetUrlsInSitemapUrls(doc.DocumentNode);

                recipeUrls.UnionWith(urls);
            }

            return recipeUrls;
        }

        protected virtual IEnumerable<string> GetLocsFromSitemap(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(n => n.Name == "loc")
                    .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                    .ToList();
        }

        protected abstract HashSet<string> GetUrlsInSitemapUrls(HtmlNode documentNode);
    }
}
