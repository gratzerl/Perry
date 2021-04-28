using System;
using System.Collections.Generic;

namespace Perry.Database.Entities
{
    public partial class Recipe
    {
        public Recipe()
        {
            Ingredients = new HashSet<Ingredient>();
            MethodSteps = new HashSet<MethodStep>();
            RecipeTags = new HashSet<RecipeTag>();
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public virtual ICollection<Ingredient> Ingredients { get; set; }
        public virtual ICollection<MethodStep> MethodSteps { get; set; }
        public virtual ICollection<RecipeTag> RecipeTags { get; set; }
    }
}
