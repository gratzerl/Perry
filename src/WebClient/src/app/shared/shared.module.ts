import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgPrimeModule } from './ng-prime.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgPrimeModule,
  ],
  exports: [
    NgPrimeModule
  ]
})
export class SharedModule { }
