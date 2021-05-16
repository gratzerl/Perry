using System.Collections.Generic;

namespace Perry.Functions.Models
{
    public class RecipeSuggestionRequestModel
    {
        public IEnumerable<string> Ingredients { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public int PageNumber { get; set; }
        public int? PageSize { get; set; }
    }
}
