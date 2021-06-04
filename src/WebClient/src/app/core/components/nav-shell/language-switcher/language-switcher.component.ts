import { Component } from '@angular/core';
import { LanguageService } from 'src/app/core/services';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.less']
})
export class LanguageSwitcherComponent {

  constructor(public languageService: LanguageService) { }

}
