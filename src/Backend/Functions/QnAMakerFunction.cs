using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Perry.Core.QnAMaker.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Perry.Functions
{
    public class QnAMakerFunction
    {
        private readonly IQnAMakerService qnaService;
        private const double MinRequiredProbability = 0.83;

        public QnAMakerFunction(IQnAMakerService qnaService)
        {
            this.qnaService = qnaService ?? throw new ArgumentNullException(nameof(qnaService));
        }

        [FunctionName("QnAMakerFunction")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "query-answer")] HttpRequest req,
            ILogger log)
        {
            var question = req.Query["question"];
            log.LogInformation($"Searching for answer to question '{question}'");

            var searchResult = await qnaService.GetAnswerAsync(question);
            var isResultValid = searchResult != null && searchResult.Score >= MinRequiredProbability;
            var answer = isResultValid ? searchResult.Answer : "No appropriate answer was found.";

            return new OkObjectResult(answer);
        }
    }
}
