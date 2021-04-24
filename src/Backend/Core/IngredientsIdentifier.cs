using System;
using System.Collections.Generic;
using System.Linq;
using Database.Entities;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.EntityFrameworkCore;

namespace Core
{
    public class IngredientsIdentifier : IIngredientsIdentifier
    {
        private readonly RecipesContext recipesContext;
        private readonly ComputerVisionClient visionClient;

        public IngredientsIdentifier(RecipesContext recipesContext, ComputerVisionClient visionClient)
        {
            this.recipesContext = recipesContext ?? throw new ArgumentNullException(nameof(recipesContext));
            this.visionClient = visionClient ?? throw new ArgumentNullException(nameof(visionClient));
        }

        public IEnumerable<string> IdentifyIngredients()
        {
            throw new NotImplementedException();
        }
    }
}
