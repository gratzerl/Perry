import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ConfigService, GlobalErrorHandler } from './services';
import { NavShellComponent } from './components';
import { RouterModule } from '@angular/router';

const appInitializer =
  (
    configService: ConfigService,
    deps: (() => Promise<unknown>)[]
  ) => () => {
    configService
      .init()
      .then(() => {
        if (deps && deps.length > 0) {
          Promise.all(deps.map(d => d()));
        }
      });
  };

@NgModule({
  declarations: [
    NavShellComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [ConfigService],
      multi: true
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
})
export class CoreModule { }
