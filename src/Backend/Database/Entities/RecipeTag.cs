using System;
using System.Collections.Generic;
using System.Text;

namespace Perry.Database.Entities
{
    public partial class RecipeTag
    {
        public Guid RecipeId { get; set; }
        public Guid TagId { get; set; }
        public Recipe Recipe { get; set; }
        public Tag Tag { get; set; }
    }
}
