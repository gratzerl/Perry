import { Injectable, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { PrimeNGConfig } from 'primeng/api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageService implements OnDestroy {
  private onDestroy = new Subject<void>();

  private languages: string[] = [];

  constructor(private ngConfig: PrimeNGConfig, private transloco: TranslocoService) { }

  init(): Promise<void> {
    this.transloco.langChanges$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        const componentTexts = this.transloco.getTranslation('primeng');
        this.ngConfig.setTranslation(componentTexts);
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

  get availableLangs(): string[] {
    return this.languages;
  }

  get activeLang(): string {
    return this.transloco.getActiveLang();
  }

  set activeLang(lang: string) {
    this.transloco.setActiveLang(lang);
  }
}
