using System.Collections.Generic;
using System.Threading.Tasks;
using Perry.Core.RecipeSuggestions.Models;

namespace Perry.Core.RecipeSuggestions.Services.Interfaces
{
    public interface IRecipeSuggestionService
    {
        public Task<PagedResponse<RecipeSuggestionModel>> FindSuggestionsAsync(IEnumerable<string> ingredients, IDictionary<string, IEnumerable<string>> tags, int pageNumber, int pageSize);
    }
}
