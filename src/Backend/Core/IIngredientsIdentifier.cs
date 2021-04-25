using System.Collections.Generic;

namespace Perry.Core
{
    public interface IIngredientsIdentifier
    {
        public IEnumerable<string> IdentifyIngredients();
    }
}
