import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPrimeModule } from './ng-prime.module';
import { TranslocoRootModule } from './transloco-root.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgPrimeModule,
    TranslocoRootModule,
    FormsModule
  ],
  exports: [
    NgPrimeModule,
    TranslocoRootModule,
    FormsModule
  ]
})
export class SharedModule { }
