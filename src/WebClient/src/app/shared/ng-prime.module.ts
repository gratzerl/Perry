import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  exports: [ButtonModule, SelectButtonModule],
})
export class NgPrimeModule { }
