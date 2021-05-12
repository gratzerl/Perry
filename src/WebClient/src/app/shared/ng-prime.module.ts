import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  exports: [
    ButtonModule,
    SelectButtonModule,
    FileUploadModule,
    CheckboxModule,
    ProgressSpinnerModule
  ],
})
export class NgPrimeModule { }
