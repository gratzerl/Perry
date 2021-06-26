import { APP_INITIALIZER, ErrorHandler, InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedModule } from '../shared/shared.module';

import { ConfigService, GlobalErrorHandler, LanguageService } from './services';
import { AppConfig } from './models';
import { LandingPageComponent } from './pages';
import {
  NavShellComponent,
  HeaderComponent,
  ContentComponent,
  LanguageSwitcherComponent,
  PageBannerComponent,
  PageInstructionsComponent,
  InstructionStepComponent,
} from './components';
import { ChatDrawerComponent } from './components/chat-drawer/chat-drawer.component';

import { ChatListItemComponent } from './components/chat-list-item/chat-list-item.component';
import { NgZorroModule } from '../shared/ng-zorro.module';

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
    ChatDrawerComponent,
    ChatListItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgZorroModule
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
    { provide: APP_CONFIG, useFactory: (configService: ConfigService) => configService.Config, deps: [ConfigService] },
    { provide: TRANSLOCO_SCOPE, useValue: { scope: 'core', alias: 'core' } }
  ],
})
export class CoreModule { }
