import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { SentMessage } from './SentMessage';
import { MessageOptions } from '../utils/Interfaces';

/**
 * CLass symbolizing a `Messages`
 * @class
 */
export class Messages {
  private _token: string;

  /**
   * Create a new Messages
   * @param {string} token
   * @constructor
   */
  constructor(token: string) {
    this._token = token;
  }

  /**
   * Get a message by ID
   * @param {string|number} id
   * @returns {Promise<SentMessage>}
   */
  public async get(id: string | number, options: MessageOptions): Promise<SentMessage> {
    if (!id) throw new SyntaxError('[MESSAGES] No id provided');
    if (!options || !options.channelID) throw new SyntaxError('[MESSAGES] No channel id provided');
    const res: any = await RestManager.prototype.request(`${DISCORD_API}channels/${options.channelID}/messages/${id}`, {
      method: 'GET',
      token: this._token,
    });
    return new SentMessage(res, this._token);
  }
}
