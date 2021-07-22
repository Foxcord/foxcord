import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { SentMessage } from './SentMessage';

interface MessageOptions {
  /**
   * The message channel ID
   */
  channelID: string | number;

  /**
   * The messge guild ID *(optional)*
   */
  guildID?: string;
}

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
  public async getByID(id: string | number, options: MessageOptions): Promise<SentMessage> {
    if (!id) throw new SyntaxError('NO_ID_PROVIDED');
    if (!options || !options.channelID) throw new SyntaxError('NO_CHANNEL_ID_PROVIDED');
    const res: any = await RestManager.prototype.REQUEST(`${DISCORD_API}channels/${options.channelID}/messages/${id}`, {
      method: 'GET',
      token: this._token,
    });
    return new SentMessage(res, this._token);
  }
}
