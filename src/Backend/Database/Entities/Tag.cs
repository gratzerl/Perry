using System;
using System.Collections.Generic;

namespace Perry.Database.Entities
{
    public partial class Tag
    {
        public Tag()
        {
            RecipeTags = new HashSet<RecipeTag>();
        }

        public Guid Id { get; set; }
        public string Text { get; set; }

        public virtual ICollection<RecipeTag> RecipeTags { get; set; }
    }
}
