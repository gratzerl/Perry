using System.Collections.Generic;

namespace Core
{
    public interface IIngredientsIdentifier
    {
        public IEnumerable<string> IdentifyIngredients();
    }
}
