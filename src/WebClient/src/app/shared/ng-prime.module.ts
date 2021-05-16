import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StepsModule } from 'primeng/steps';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  exports: [
    ButtonModule,
    DropdownModule,
    PaginatorModule,
    SelectButtonModule,
    FileUploadModule,
    CheckboxModule,
    ProgressSpinnerModule,
    StepsModule,
    CardModule
  ],
})
export class NgPrimeModule { }
