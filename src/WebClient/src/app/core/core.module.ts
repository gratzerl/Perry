import { APP_INITIALIZER, ErrorHandler, InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { SharedModule } from '../shared/shared.module';

import { ConfigService, GlobalErrorHandler, LanguageService } from './services';
import { NavShellComponent, HeaderComponent, ContentComponent, LanguageSwitcherComponent } from './components/nav-shell';
import { LandingPageComponent, InstructionStepComponent, PageBannerComponent, PageInstructionsComponent } from './pages/landing-page';
import { AppConfig } from './models';

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
    NavShellComponent,
    LandingPageComponent,
    HeaderComponent,
    ContentComponent,
    InstructionStepComponent,
    LanguageSwitcherComponent,
    PageBannerComponent,
    PageInstructionsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    {
      provide: INIT_DEPS,
      useFactory: (langService: LanguageService) =>
        [
          () => langService.init()
        ],
      deps: [LanguageService]
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [ConfigService, INIT_DEPS],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: APP_CONFIG, useFactory: (configService: ConfigService) => configService.Config, deps: [ConfigService] }
  ],
})
export class CoreModule { }
