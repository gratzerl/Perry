import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-instruction-step',
  templateUrl: './instruction-step.component.html',
  styleUrls: ['./instruction-step.component.scss'],
})
export class InstructionStepComponent {

  @Input()
  title!: string;

  @Input()
  description!: string;

  @Input()
  imageSrc!: string;

  constructor() { }

}
