using System;

namespace Perry.Core.RecipeSuggestions.Models
{
    public class RecipeSuggestionModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
    }
}
