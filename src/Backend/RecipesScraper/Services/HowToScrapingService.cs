using ClosedXML.Excel;
using Microsoft.Extensions.Logging;
using Perry.Database.Entities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Perry.RecipesScraper.Services
{
    public class HowToScrapingService
    {
        private readonly ILogger<HowToScrapingService> logger;
        private readonly IEnumerable<IHowToScraper> scrapers;

        public HowToScrapingService(RecipesContext recipeContext, ILogger<HowToScrapingService> logger, IEnumerable<IHowToScraper> scrapers)
        {
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
            this.scrapers = scrapers ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task ScrapeHowTosAsync()
        {           
            logger.LogInformation("Starting scraper...");
            var scrapingTasks = scrapers.Select(s => s.ScrapeHowTosAsync()).ToList();
            var scrapedHowTos = await Task.WhenAll(scrapingTasks).ConfigureAwait(false);
            logger.LogInformation("Scrapers finished.");

            CreateAndSaveExcelFile(scrapedHowTos.First());
            logger.LogInformation($"{scrapedHowTos.First().Count} howTos saved.");
        }

        private void CreateAndSaveExcelFile(Dictionary<string, string> questionsAndAnswers)
        {
            using (XLWorkbook workbook = new XLWorkbook())
            {
                IXLWorksheet sheet = workbook.Worksheets.Add("HowTo");
                sheet.Cell(1, 1).InsertTable(questionsAndAnswers);
                sheet.Columns().AdjustToContents();

                var workbookStream = new MemoryStream();
                workbook.SaveAs(workbookStream);

                var filePath = @"C:\temp";
                var fileName = "HowTo-" + DateTime.Now.ToShortDateString() + ".xlsx";

                using (FileStream fs = File.Create(Path.Combine(filePath, fileName)))
                {
                    fs.Write(workbookStream.GetBuffer());
                }
            }
        }
    }
}
