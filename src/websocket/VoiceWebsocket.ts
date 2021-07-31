import ws from 'ws';

export class VoiceWebsocket {
  private endpoint: string;
  private socket!: ws;

  constructor(endpoint: any) {
    this.endpoint = endpoint;
    this.initConnection();
  }

  private async initConnection() {
    this.socket = new ws(`wss://${this.endpoint}`);
    this.socket.on('message', (message: any) => this.onMessage(message));
  }

  private onMessage(message: any) {
    let parsedMsg: any;
    try {
      parsedMsg = JSON.parse(message);
      console.log(parsedMsg);
    } catch (err) {
      return console.error(err);
    }
  }
}
