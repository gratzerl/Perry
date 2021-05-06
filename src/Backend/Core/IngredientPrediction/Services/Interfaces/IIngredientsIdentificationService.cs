using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Perry.Core.IngredientPrediction.Models;

namespace Perry.Core.IngredientPrediction.Services.Interfaces
{
    public interface IIngredientsIdentificationService
    {
        public Task<IEnumerable<IngredientPredictionModel>> IdentifyIngredientsAsync(Stream fileStream);
    }
}
