export interface RoutedStep {
  labelKey: string,
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
