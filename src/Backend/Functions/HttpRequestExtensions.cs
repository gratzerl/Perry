using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Perry.Functions
{
    public static class HttpRequestExtensions
    {
        public static IEnumerable<string> ReadIngredientsFromQuery(this HttpRequest req)
        {
            return req.Query
               .Where(entry => entry.Key.ToLower().Contains("ingredient"))
               .Select(entry => entry.Value.ToString())
               .Where(entry => !string.IsNullOrWhiteSpace(entry))
               .ToList();
        }

        public static IDictionary<string, IEnumerable<string>> ReadTagsFromQuery(this HttpRequest req)
        {
            return req.Query
                .Where(entry => entry.Key.ToLower().Contains("tag") && !string.IsNullOrWhiteSpace(entry.Value))
                .Select(entry => (entry.Key.Split(':')[1], entry.Value))
                .GroupBy(kvp => kvp.Item1)
                .ToDictionary(g => g.Key, g => g.SelectMany(pair => pair.Value).ToList().AsEnumerable());
        }
    }
}
