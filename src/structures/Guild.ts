import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { GuildWelcomeScreen, WidgetStyleOptions } from '../utils/Interfaces';

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

  /**
   * Get the guild welcome screen
   * @returns {Promise<GuildWelcomeScreen>}
   */
  public async welcomeScreen(): Promise<GuildWelcomeScreen> {
    const res = await RestManager.prototype.REQUEST(`${DISCORD_API}guilds/${this.id}/welcome-screen`, {
      method: 'GET',
      token: this._token,
    });
    let formatRes = JSON.stringify(res);
    formatRes = formatRes.replace('welcome_channels', 'channels');
    for (var i = 0; i < 6; i++) {
      formatRes = formatRes.replace('channel_id', 'id');
    }
    formatRes = await JSON.parse(formatRes);
    return await JSON.parse(formatRes);
  }

  /**
   * Generate widget image
   * @param {WidgetStyleOptions} options
   * @returns {string}
   */
  public widgetImage(options?: WidgetStyleOptions): string {
    return `${DISCORD_API}guilds/713699044811341895/widget.png?style=${
      options && options.style && typeof options.style === 'string'
        ? options.style === '0'
          ? 'shield'
          : `banner` + options.style
        : 'banner1'
    }`;
  }
}
