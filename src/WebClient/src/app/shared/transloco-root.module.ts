import { HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import de from '@angular/common/locales/de';

import { NzI18nInterface, NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US, de_DE } from 'ng-zorro-antd/i18n';

import {
  TRANSLOCO_LOADER,
  Translation,
  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule
} from '@ngneat/transloco';
import { Injectable, LOCALE_ID, NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';

registerLocaleData(en);
registerLocaleData(de);

export function getLocaleForLang(lang: string): NzI18nInterface {
  switch (lang) {
    case 'en':
      return en_US;
    case 'de':
      return de_DE;
    default:
      return en_US;
  }
};

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) { }

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: NZ_I18N,
      useFactory: (localId: string) => getLocaleForLang(localId),
      deps: [LOCALE_ID]
    },
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'de'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  ]
})
export class TranslocoRootModule { }
