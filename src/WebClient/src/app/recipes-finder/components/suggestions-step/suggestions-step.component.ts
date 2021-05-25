import { Component, OnInit } from '@angular/core';
import { RecipeStepperService } from '../../services';

@Component({
  selector: 'app-suggestions-step',
  templateUrl: './suggestions-step.component.html',
  styleUrls: ['./suggestions-step.component.scss']
})
export class SuggestionsStepComponent {

  constructor(public stepperService: RecipeStepperService) { }

}
