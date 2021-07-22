import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { Guild } from './Guild';

/**
 * CLass symbolizing a `Guilds`
 * @class
 */
export class Guilds {
  private _token: string;

  /**
   * Create a new Guilds
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
  public async getByID(id: string | number): Promise<Guild> {
    if (!id) throw new SyntaxError('NO_ID_PROVIDED');
    const res: any = await RestManager.prototype.REQUEST(`${DISCORD_API}guilds/${id}`, {
      method: 'GET',
      token: this._token,
    });
    const parsedData = JSON.parse(res);
    return new Guild(parsedData.id, this._token);
  }
}
