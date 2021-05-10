import { Component } from '@angular/core';
import { LanguageService } from 'src/app/core/services';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss']
})
export class LanguageSwitcherComponent {

  availableLangs: string[];

  constructor(public languageService: LanguageService) {
    this.availableLangs = languageService.availableLangs;
  }
}
