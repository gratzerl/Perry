import { RoutedStep } from "../models";
import { RoutedStepStatus } from "../models/routed-step.model";

export const recipeFinderSteps: RoutedStep[] = [
  {
    titleKey: 'rf.ingredients.step-title',
    descriptionKey: 'rf.ingredients.step-description',
    route: 'identification',
    isRequired: true,
    status: RoutedStepStatus.None
  },
  {
    titleKey: 'rf.preferences.step-title',
    descriptionKey: 'rf.preferences.step-description',
    route: 'preferences',
    isRequired: false,
    status: RoutedStepStatus.None
  }
];
