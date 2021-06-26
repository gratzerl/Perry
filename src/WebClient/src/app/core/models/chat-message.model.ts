export class ChatMessage {
  constructor(
    public dateTime: string,
    public isInput: boolean,
    public message: string
  ) {   }
}