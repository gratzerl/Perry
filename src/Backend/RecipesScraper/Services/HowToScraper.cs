using HtmlAgilityPack;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Perry.RecipesScraper.Services
{
    public class HowToScraper : GenericScraper, IHowToScraper
    {       
        protected readonly ILogger<HowToScraper> logger;
        private const string glossaryBaseUrl = "https://www.bbcgoodfood.com/glossary";
        private const string sitemapBaseUrl = "https://www.bbcgoodfood.com/wp-sitemap.xml";
        public HowToScraper(ILogger<HowToScraper> logger, HtmlWeb web) : base(web)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Dictionary<string, string>> ScrapeHowTosAsync()
        {
            logger.LogInformation($"Start scraping how-tos from {sitemapBaseUrl}...");

            var urls = await GetUrlsFromSitemapAsync(sitemapBaseUrl);
            logger.LogInformation($"Found {urls.Count()} how-to urls");

            var howTos = await ParseHowTosFromUrlsAsync(urls);
            logger.LogInformation($"Created {howTos.Count()} how-tos");

            return howTos;
        }

        protected async Task<Dictionary<string, string>> ParseHowTosFromUrlsAsync(IEnumerable<string> urls)
        {
            var howTos = new Dictionary<string, string>();

            foreach (var url in urls)
            {
                try
                {
                    var doc = await web.LoadFromWebAsync(url);

                    var name = GetName(doc.DocumentNode);
                    var questionsAndAnswers = GetQuestionsAndAnswers(doc.DocumentNode, name);

                    foreach (var pair in questionsAndAnswers)
                    {
                        howTos.TryAdd(pair.Key, pair.Value);
                    }

#if DEBUG
                    if (howTos.Count > 10)
                    {
                        break;
                    }
#endif
                }
                catch (Exception)
                {
                    logger.LogWarning($"Failed to parse how-to from url: ${url}. Skipping it.");
                }
            }

            return howTos;
        }

        protected override IEnumerable<string> GetLocsFromSitemap(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(n => n.Name == "loc" && n.InnerText.Contains("glossary"))
                    .Select(n => HttpUtility.HtmlDecode(n.InnerText))
                    .ToList();
        }

        protected override HashSet<string> GetUrlsInSitemapUrls(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .Where(node => node.Name == "loc" && node.InnerText.StartsWith(glossaryBaseUrl))
                    .Select(node => HttpUtility.HtmlDecode(node.InnerText))
                    .ToHashSet();
        }

        private string GetName(HtmlNode documentNode)
        {
            return documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("template-article__title"))
                    .FirstChild?.InnerHtml ?? string.Empty;
        }

        private Dictionary<string, string> GetQuestionsAndAnswers(HtmlNode documentNode, string name)
        {
            var children = documentNode
                    .Descendants()
                    .FirstOrDefault(n => n.HasClass("template-article__editor-content"))
                    .ChildNodes;

            if (!children.Any())
            {
                return new Dictionary<string, string>();
            }

            var questionsAndAnswers = new Dictionary<string, string>();
            (string question, string answer) pair = ($"What is {name}?", "");
            foreach(var child in children)
            {
                if (child.Name == "h3")
                {
                    if (!string.IsNullOrEmpty(pair.question) && !string.IsNullOrEmpty(pair.answer))
                    {
                        questionsAndAnswers.Add(pair.question, pair.answer);
                    }
                    pair.question = CleanQuestion(child.InnerText, name);
                    pair.answer = "";
                }
                else if (child.Name == "p" && !child.InnerText.Contains("video"))
                {
                    pair.answer += child.InnerText + Environment.NewLine;
                }
            }

            return questionsAndAnswers;
        }

        private string CleanQuestion(string question, string name)
        {
            switch (question)
            {
                case "Availability":
                    return $"Where is {name} available?";
                case "Choose the best":
                    return $"How to choose the best {name}?";
                case "Alternatives":
                    return $"What are alternatives for {name}?";
            }

            if (!question.EndsWith("?"))
            {
                question += "?";
            }

            question.Replace(" it", $" {name}");
            return question;
        }
    }
}
