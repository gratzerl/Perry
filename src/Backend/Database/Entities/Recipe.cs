using System;
using System.Collections.Generic;

namespace Perry.Database.Entities
{
    public partial class Recipe
    {
        public Recipe()
        {
            RecipeTags = new HashSet<RecipeTag>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string Ingredients { get; set; }
        public string Method { get; set; }

        public virtual ICollection<RecipeTag> RecipeTags { get; set; }
    }
}
