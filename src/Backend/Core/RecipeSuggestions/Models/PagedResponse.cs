using System;
using System.Collections.Generic;

namespace Perry.Core.RecipeSuggestions.Models
{
    public class PagedResponse<T>
    {
        public int CurrentPageNumber { get; set; }
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Items { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
        public bool HasNext => CurrentPageNumber < TotalPages;
        public bool HasPrevious => CurrentPageNumber > 1;
    }
}
