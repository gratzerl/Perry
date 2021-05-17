import { Inject, Injectable, LOCALE_ID, OnDestroy } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getLocaleForLang } from 'src/app/shared/transloco-root.module';


@Injectable({
  providedIn: 'root'
})
export class LanguageService implements OnDestroy {
  private onDestroy = new Subject<void>();
  private languages: string[] = [];

  constructor(@Inject(LOCALE_ID) private locale: string, private ngZorroI18n: NzI18nService, private transloco: TranslocoService) { }

  init(): Promise<void> {
    this.setComponentLocale(this.locale);

    this.transloco.langChanges$
      .pipe(takeUntil(this.onDestroy))
      .subscribe((lang) => {
        this.setComponentLocale(lang);
      });

    this.transloco.getAvailableLangs()
      .forEach((obj: string | { id: string; label: string }) => {
        if (typeof obj === 'string') {
          this.languages.push(obj);
        } else {
          this.languages.push(obj.label);
        }
      });

    return Promise.resolve();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  get langChanges(): Observable<string> {
    return this.transloco.langChanges$;
  }

  get availableLangs(): string[] {
    return this.languages;
  }

  get activeLang(): string {
    return this.transloco.getActiveLang();
  }

  set activeLang(lang: string) {
    this.transloco.setActiveLang(lang);
  }

  private setComponentLocale(lang: string): void {
    const loc = getLocaleForLang(lang);
    this.ngZorroI18n.setLocale(loc);
  }
}
