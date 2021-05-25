import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientsStepComponent, PreferencesStepComponent, SuggestionsStepComponent } from './components';
import { RecipesFinderComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: RecipesFinderComponent,
    children: [
      {
        path: 'identification',
        component: IngredientsStepComponent
      },
      {
        path: 'preferences',
        component: PreferencesStepComponent
      },
      {
        path: 'suggestions',
        component: SuggestionsStepComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesFinderRoutingModule { }
