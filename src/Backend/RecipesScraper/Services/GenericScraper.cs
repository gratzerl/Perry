using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using HtmlAgilityPack;

namespace Perry.RecipesScraper.Services
{
    public abstract class GenericScraper
    {
        protected readonly HtmlWeb web;

        public GenericScraper(HtmlWeb web)
        {
            this.web = web ?? throw new ArgumentNullException(nameof(web));
        }

        protected async Task<IEnumerable<string>> GetUrlsFromSitemapAsync(string sitemapBaseUrl)
        {
            var doc = await web.LoadFromWebAsync(sitemapBaseUrl);

            var sitemapLocs = GetLocsFromSitemap(doc.DocumentNode);

            var collectedUrls = new HashSet<string>();

            foreach (var loc in sitemapLocs)
            {
                doc = await web.LoadFromWebAsync(loc);

                var urls = GetUrlsInSitemapUrls(doc.DocumentNode);

                collectedUrls.UnionWith(urls);
#if DEBUG
                if (collectedUrls.Count > 10)
                {
                    break;
                }
#endif
            }

            return collectedUrls;
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
