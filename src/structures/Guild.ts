/**
 * Class symbolizing a `Guild`
 * @class
 */
export class Guild {
  /**
   * The guild ID
   */
  public id!: string;

  private _token: string;

  /**
   * Create a new Channel
   * @param {string} id
   * @param {string} token
   * @constructor
   */
  constructor(id: string, token: string) {
    this.id = id;
    this._token = token;
  }
}
