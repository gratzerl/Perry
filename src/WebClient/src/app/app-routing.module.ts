import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavShellComponent } from './core/components';

const routes: Routes = [
  {
    path: '',
    component: NavShellComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./recipes-finder/recipes-finder.module').then(m => m.RecipesFinderModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
