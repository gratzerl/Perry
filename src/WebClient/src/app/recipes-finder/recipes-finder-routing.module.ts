import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientsIdentificationComponent, PerferenceSelectionComponent } from './components';
import { RecipesFinderComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: RecipesFinderComponent,
    children: [
      {
        path: '',
        redirectTo: 'identification',
        pathMatch: 'full'
      },
      {
        path: 'identification',
        component: IngredientsIdentificationComponent
      },
      {
        path: 'preferences',
        component: PerferenceSelectionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesFinderRoutingModule { }
