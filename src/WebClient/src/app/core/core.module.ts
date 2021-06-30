import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedModule } from '../shared/shared.module';

import { GlobalErrorHandler } from './services';
import { LandingPageComponent } from './pages';
import {
  NavShellComponent,
  HeaderComponent,
  ContentComponent,
  LanguageSwitcherComponent,
  PageBannerComponent,
  PageInstructionsComponent,
  InstructionStepComponent,
  ChatDrawerComponent,
  ChatListComponent,
  ChatListItemComponent
} from './components';

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
    ChatListItemComponent,
    ChatListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  providers: [    
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: TRANSLOCO_SCOPE, useValue: { scope: 'core', alias: 'core' } }
  ],
})
export class CoreModule { }
