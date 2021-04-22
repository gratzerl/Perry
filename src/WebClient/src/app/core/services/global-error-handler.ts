/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error(error);
  }
}
