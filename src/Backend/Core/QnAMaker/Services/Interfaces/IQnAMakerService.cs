using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker.Models;
using System.Threading.Tasks;

namespace Perry.Core.QnAMaker.Services.Interfaces
{
    public interface IQnAMakerService
    {
        public Task<QnASearchResult> GetAnswerAsync(string question);
    }
}
