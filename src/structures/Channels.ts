import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { Channel } from './Channel';

/**
 * CLass symbolizing a `Channels`
 * @class
 */
export class Channels {
  private _token: string;

  /**
   * Create a new Channels
   * @param {string} token
   * @constructor
   */
  constructor(token: string) {
    this._token = token;
  }

  /**
   * Get a channel by ID
   * @param {string|number} id
   * @returns {Promise<Channel>}
   */
  public async getByID(id: string | number): Promise<Channel> {
    if (!id) throw new SyntaxError('NO_ID_PROVIDED');
    const res: any = await RestManager.prototype.REQUEST(`${DISCORD_API}channels/${id}`, {
      method: 'GET',
      token: this._token,
    });
    const parsedData = JSON.parse(res);
    return new Channel(parsedData.id, this._token);
  }
}
