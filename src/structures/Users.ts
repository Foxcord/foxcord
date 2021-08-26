import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { User } from './User';

/**
 * CLass symbolizing a `Users`
 * @class
 */
export class Users {
  private _token: string;

  /**
   * Create a new Users
   * @param {string} token
   * @constructor
   */
  constructor(token: string) {
    this._token = token;
  }

  /**
   * Get a user by ID
   * @param {string|number} id
   * @returns {Promise<User>}
   */
  public async getByID(id: string | number): Promise<User> {
    if (!id) throw new SyntaxError('[USERS] No id provided');
    const res: any = await RestManager.prototype.REQUEST(`${DISCORD_API}users/${id}`, {
      method: 'GET',
      token: this._token,
    });
    return new User(res, this._token);
  }
}
