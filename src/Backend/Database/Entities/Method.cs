using System;

namespace Perry.Database.Entities
{
    public partial class MethodStep
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public string Text { get; set; }

        public virtual Recipe Recipe { get; set; }
    }
}
