using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Perry.Core.IngredientPrediction
{
    public interface IIngredientsIdentificationService
    {
        public Task<IEnumerable<IngredientPrediction>> IdentifyIngredientsAsync(Stream fileStream);
    }
}
