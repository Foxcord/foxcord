import { RestManager } from '../rest/RestManager';
import { DISCORD_CDN, imageFormat, imageSize, DISCORD_API } from '../utils/Constants';
import { Badges } from './Badges';
import { DiscordEmbed } from './DiscordEmbed';
import { SentMessage } from '../structures/SentMessage';
import { AvatarURL, SendOptionsWithFile } from '../utils/Interfaces';

/**
 * Class symbolizing a `User`
 * @class
 */
export class User {
  public avatar!: string;
  public id!: string;
  public discriminator!: string;
  public username!: string;
  public badges!: Badges;
  public bot!: boolean;
  public tag!: string;
  private _token: string;

  /**
   * Create a new User
   * @param {object|any} messageData
   * @param {string} token
   * @constructor
   */
  constructor(messageData: object | any, token: string) {
    this._token = token;
    this._patchData(JSON.parse(messageData));
  }

  /**
   * Get the user avatar URL
   * @param {AvatarURL} options
   * @returns {string|undefined}
   * @example
   * console.log(user.avatarURL({
   *      format: 'jpg',
   *      size: '1024'
   * }));
   */
  public avatarURL(options?: AvatarURL): string | undefined {
    if (this.avatar === null) return undefined;
    if (!options) return `${DISCORD_CDN}avatars/${this.id}/${this.avatar}.png`;
    return `${DISCORD_CDN}avatars/${this.id}/${this.avatar}${
      options.format && typeof options.format === 'string' && imageFormat.indexOf(options.format.toLowerCase()) > -1
        ? '.' + options.format
        : '.png'
    }${options.size && imageSize.indexOf(Number(options.size)) > -1 ? '?size=' + options.size : '?size=128'}`;
  }

  public async send(message: string | number | DiscordEmbed | any, options?: SendOptionsWithFile) {
    if (!message) throw new SyntaxError('[USER] No message provided');
    const payload = {
      content: '',
      embeds: [] as any,
      components: [] as any,
    };
    if (options?.files) {
      RestManager.prototype.POSTFILE(`${DISCORD_API}users/${this.id}/messages`, options.files, {
        token: this._token,
        method: 'POST',
      });
    }
    switch (typeof message) {
      case 'string':
        payload.content = message;
        break;
      case 'number':
        payload.content = String(message);
        break;
      case 'object':
        try {
          payload.embeds = [message.getJSON()];
        } catch (err) {
          throw new Error('[USER] Invalid embed');
        }
        break;
      default:
        throw new Error('[USER] Invalid content');
    }
    if (options?.button && options.selectMenu) throw new SyntaxError('[USER] Too many components');
    if (options?.button) {
      payload.components = [
        {
          type: 1,
          components: Array.isArray(options.button)
            ? options.button.map((btn) => btn.getJSON())
            : [options.button.getJSON()],
        },
      ];
    }
    if (options?.selectMenu) {
      if (Array.isArray(options.selectMenu)) throw new SyntaxError('[USER] Select meny is array');
      payload.components = [
        {
          type: 1,
          components: [options.selectMenu.getJSON()],
        },
      ];
    }
    const res: any = await RestManager.prototype.REQUEST(`${DISCORD_API}users/${this.id}/messages`, {
      token: this._token,
      data: JSON.stringify(payload),
    });
    return new SentMessage(await res, this._token);
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: any): Promise<void> {
    this.avatar = data.avatar;
    this.id = data.id;
    this.discriminator = data.discriminator;
    this.username = data.username;
    this.badges = new Badges(data.public_flags);
    this.tag = `${this.username}#${this.discriminator}`;
    this.bot = data.bot ? true : false;
  }
}
