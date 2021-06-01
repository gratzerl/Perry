import { Component } from '@angular/core';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {

  constructor(public stepperService: RecipeStepperService) { }

  restartStepper(): void {
    this.stepperService.goToStepIndex(0);
  }

}
