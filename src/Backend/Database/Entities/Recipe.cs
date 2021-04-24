using System;

namespace Perry.Database.Entities
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string Method { get; set; }
        public string Ingredients { get; set; }
    }
}
