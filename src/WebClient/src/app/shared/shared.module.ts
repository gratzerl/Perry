import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslocoRootModule } from './transloco-root.module';
import { NgZorroModule } from './ng-zorro.module';

import { LoadingSpinnerComponent } from './components';
import { Observable } from 'rxjs';
import { AppConfig } from '../core/models';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from '../core/services/config.service';
import { LanguageService } from '../core/services/language.service';

export const APP_CONFIG = new InjectionToken<AppConfig>('AppConfig');

const INIT_DEPS = new InjectionToken<(() => Observable<unknown>)[]>('InitDependencies');

const appInitializer = (
  configService: ConfigService,
  deps: (() => Observable<unknown>)[]
) => () => {
  return configService.init()
    .then(() => {
      const dependentObs = deps.map(dep => dep());
      Promise.all(dependentObs);
    });
};

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
  ],
  providers: [

    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [ConfigService, INIT_DEPS],
      multi: true,
    },
    {
      provide: INIT_DEPS,
      useFactory: (langService: LanguageService) =>
        [
          () => langService.init()
        ],
      deps: [LanguageService]
    },
    { provide: APP_CONFIG, useFactory: (configService: ConfigService) => configService.Config, deps: [ConfigService] },
  ]
})
export class SharedModule { }
