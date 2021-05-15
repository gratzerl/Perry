import { RoutedStep } from "../models";
import { RoutedStepStatus } from "../models/routed-step.model";

export const recipeFinderSteps: RoutedStep[] = [
  {
    labelKey: 'rf.ingredients.step-label',
    route: 'identification',
    isRequired: true,
    status: RoutedStepStatus.None
  },
  {
    labelKey: 'rf.preferences.step-label',
    route: 'preferences',
    isRequired: false,
    status: RoutedStepStatus.None
  }
];
