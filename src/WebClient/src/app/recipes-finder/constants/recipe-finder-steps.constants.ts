import { RoutedStep } from "../models";
import { RoutedStepStatus } from "../models/routed-step.model";

export const recipeFinderSteps: RoutedStep[] = [
  {
    titleKey: 'rf.ingredients.step-title',
    descriptionKey: 'rf.ingredients.step-description',
    route: 'ingredients',
    isRequired: true,
    status: RoutedStepStatus.None
  },
  {
    titleKey: 'rf.preferences.step-title',
    descriptionKey: 'rf.preferences.step-description',
    route: 'preferences',
    isRequired: false,
    status: RoutedStepStatus.None
  },
  {
    titleKey: 'rf.summary.step-title',
    descriptionKey: 'rf.summary.step-description',
    route: 'summary',
    isRequired: false,
    status: RoutedStepStatus.None
  }
];
