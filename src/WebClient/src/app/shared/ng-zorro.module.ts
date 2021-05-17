import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzLayoutModule } from 'ng-zorro-antd/layout';


@NgModule({
  exports: [
    NzButtonModule,
    NzPaginationModule,
    NzSpinModule,
    NzUploadModule,
    NzCardModule,
    NzCheckboxModule,
    NzStepsModule,
    NzSelectModule,
    NzRadioModule,
    NzIconModule,
    NzLayoutModule,
    NzTypographyModule,
  ]
})
export class NgZorroModule { }