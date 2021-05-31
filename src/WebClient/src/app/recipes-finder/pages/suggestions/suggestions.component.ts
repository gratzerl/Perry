import { Component } from '@angular/core';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss']
})
export class SuggestionsComponent {

  constructor(public stepperService: RecipeStepperService) { }

  restartStepper(reset: boolean = false): void {
    if (reset) {
      this.stepperService.reset();
    }

    this.stepperService.goToStepIndex(0);
  }

}
