using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Perry.Core
{
    public interface IIngredientsIdentifier
    {
        public Task<IEnumerable<string>> IdentifyIngredientsAsync(Stream fileStream);
    }
}
