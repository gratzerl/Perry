export interface RoutedStep {
  titleKey: string,
  descriptionKey: string,
  route: string,
  isRequired: boolean,
  status: RoutedStepStatus
}

export enum RoutedStepStatus {
  None,
  Loading,
  Invalid,
  Valid
}
