using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker;
using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker.Models;
using Perry.Core.QnAMaker.Models;
using Perry.Core.QnAMaker.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Perry.Core.QnAMaker.Services
{
    public class QnAMakerService : IQnAMakerService
    {
        private readonly QnAMakerConfig configuration;
        private readonly IQnAMakerRuntimeClient runtimeClient;

        public QnAMakerService(QnAMakerRuntimeClient runtimeClient, QnAMakerConfig configuration)
        {
            this.runtimeClient = runtimeClient ?? throw new ArgumentNullException(nameof(runtimeClient));
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<QnASearchResult> GetAnswerAsync(string question)
        {
#if DEBUG
            return new QnASearchResult(answer: "This is debug, this is your answer", score: 90);
#else
            var response = await runtimeClient.Runtime.GenerateAnswerAsync(configuration.KnowledgeDatabase, new QueryDTO { Question = question });
            var answers = response.Answers.OrderByDescending(a => a.Score);
            return answers.FirstOrDefault();
#endif
        }
    }
}
