import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesFinderComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: RecipesFinderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesFinderRoutingModule { }
