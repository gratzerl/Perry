using System.Collections.Generic;
using System.Threading.Tasks;
using Perry.Core.RecipeSuggestions.Models;

namespace Perry.Core.RecipeSuggestions.Services.Interfaces
{
    public interface IRecipeSuggestionService
    {
        public Task<IEnumerable<RecipeSuggestionModel>> FindSuggestionsAsync(IEnumerable<string> ingredients, IEnumerable<string> tags, int pageNumber, int pageSize);
    }
}
