import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslocoRootModule } from './transloco-root.module';
import { NgZorroModule } from './ng-zorro.module';

import { LoadingSpinnerComponent } from './components';


@NgModule({
  declarations: [
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    TranslocoRootModule,
    FormsModule,
    NgZorroModule
  ],
  exports: [
    TranslocoRootModule,
    FormsModule,
    LoadingSpinnerComponent,
    NgZorroModule
  ]
})
export class SharedModule { }
