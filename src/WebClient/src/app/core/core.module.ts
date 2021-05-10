import { APP_INITIALIZER, ErrorHandler, InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { ConfigService, GlobalErrorHandler, LanguageService } from './services';
import { NavShellComponent, HeaderComponent, ContentComponent } from './components';
import { LandingPageComponent, InstructionStepComponent } from './pages';
import { LanguageSwitcherComponent } from './components/nav-shell/language-switcher/language-switcher.component';
import { Observable } from 'rxjs';

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
  ],
  imports: [CommonModule, SharedModule, RouterModule],
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
  ],
})
export class CoreModule { }
