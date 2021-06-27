import { formatDate } from '@angular/common';

export class ChatMessage {
  public message: string;
  public isInput: boolean;
  public dateTime: string;

  constructor(
    message: string,
    isInput: boolean
  ) {
    this.message = message;
    this.isInput = isInput;
    this.dateTime = formatDate(new Date(), 'dd-MM-yyyy H:mm:ss', 'de-DE');
  }
}