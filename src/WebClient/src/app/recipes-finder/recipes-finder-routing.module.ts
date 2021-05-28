import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientsStepComponent, PreferencesStepComponent, SummaryStepComponent } from './components';
import { RecipesFinderComponent, SuggestionsComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: RecipesFinderComponent,
    children: [
      {
        path: '',
        redirectTo: 'ingredients'
      },
      {
        path: 'ingredients',
        component: IngredientsStepComponent
      },
      {
        path: 'preferences',
        component: PreferencesStepComponent
      },
      {
        path: 'summary',
        component: SummaryStepComponent
      }
    ],
  },
  {
    path: 'suggestions',
    component: SuggestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesFinderRoutingModule { }
