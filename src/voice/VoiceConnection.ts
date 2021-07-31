import { Websocket } from '../websocket/Websocket';
import { _testURL } from '../utils/Utils';
import { Collection } from '../utils/Collection';
import { VoiceWebsocket } from '../websocket/VoiceWebsocket';
import { VOICE_OPCODES } from '../utils/Constants';

export class VoiceConnection {
  private WS: Websocket;
  private voiceWebsocketMap: Collection<string, string> = new Collection();
  private guildID: string;
  private VoiceWS!: VoiceWebsocket;

  constructor(ws: Websocket, guildID: string, endpoint: any) {
    this.WS = ws;
    this.guildID = guildID;
    this.setVoiceGuildEndpoint(endpoint);
  }

  /*
  public async play(track: string) {
    this.VoiceWS = new VoiceWebsocket(this.voiceWebsocketMap.get(this.guildID));
  }
  */

  /**
   * Set speaking
   * @param {boolean} state
   * @returns {void}
   */
  public setSpeaking(state?: boolean): void {
    this.WS.sendToWS(VOICE_OPCODES.SPEAKING, {
      speaking: state || true,
      delay: 0,
      ssrc: 1,
    });
  }

  private setVoiceGuildEndpoint(endpoint: any): void {
    setTimeout(async () => {
      this.voiceWebsocketMap.set(this.guildID, endpoint);
      console.log(this.voiceWebsocketMap.get(this.guildID));
    }, 5000);
  }
}
