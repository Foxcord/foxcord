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
   * @returns {Promise<Guild>}
   */
  public async get(id: string | number): Promise<Guild> {
    if (!id) throw new SyntaxError('[GUILDS] No id provided');
    const res: any = await RestManager.prototype.request(`${DISCORD_API}guilds/${id}`, {
      method: 'GET',
      token: this._token,
    });
    const parsedData = JSON.parse(res);
    return new Guild(parsedData.id, this._token);
  }
}
