import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslocoRootModule } from './transloco-root.module';
import { NgPrimeModule } from './ng-prime.module';

import { LoadingSpinnerComponent } from './components';


@NgModule({
  declarations: [
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    NgPrimeModule,
    TranslocoRootModule,
    FormsModule
  ],
  exports: [
    NgPrimeModule,
    TranslocoRootModule,
    FormsModule,
    LoadingSpinnerComponent
  ]
})
export class SharedModule { }
