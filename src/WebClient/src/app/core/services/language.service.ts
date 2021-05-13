import { Injectable, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService implements OnDestroy {
  private onDestroy = new Subject<void>();

  private languages: string[] = [];

  constructor(private ngConfig: PrimeNGConfig, private transloco: TranslocoService) { }

  init(): Promise<void> {
    this.updateNgConfig(this.activeLang);

    this.transloco.langChanges$
      .pipe(takeUntil(this.onDestroy))
      .subscribe((lang) => this.updateNgConfig(lang));

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

  private updateNgConfig(lang: string): void {
    const componentTexts = this.transloco.getTranslation(lang);
    this.ngConfig.setTranslation(componentTexts['core.primeng']);
  }
}
