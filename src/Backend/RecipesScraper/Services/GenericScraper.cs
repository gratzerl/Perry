using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        protected abstract IEnumerable<string> GetLocsFromSitemap(HtmlNode documentNode);

        protected abstract HashSet<string> GetUrlsInSitemapUrls(HtmlNode documentNode);
    }
}
