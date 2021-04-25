using System;
using System.Collections.Generic;
using System.Text;

namespace Perry.Database.Entities
{
    public partial class Ingredient
    {
        public Guid Id { get; set; }
        public string Text { get; set; }

        public virtual Recipe Recipe { get; set; }
    }
}
