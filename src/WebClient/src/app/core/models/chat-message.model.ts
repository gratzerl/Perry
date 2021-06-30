import { formatDate } from '@angular/common';

export class ChatMessage {
  public dateTime: string;

  constructor(
    public message: string,
    public isInput: boolean
  ) {
    this.dateTime = formatDate(new Date(), 'dd-MM-yyyy H:mm:ss', 'de-DE');
  }
}