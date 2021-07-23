import { RestManager } from '../rest/RestManager';
import { DISCORD_API, DISCORD_CDN, imageFormat, imageSize } from '../utils/Constants';

type ImageSize = '128' | '256' | '512' | '1024';

type ImageFormat = 'jpg' | 'jpeg' | 'gif' | 'png' | 'tiff' | 'bmp';

interface AvatarURL {
  /**
   * Image size
   * @default 128
   */
  size?: ImageSize;

  /**
   * Image format
   * @default 'png'
   */
  format?: ImageFormat;
}

export class Member {
  /**
   * The member roles
   */
  public roles!: string[];

  /**
   * The member ID
   */
  public id!: string;

  /**
   * The member username
   */
  public username!: string;

  /**
   * The member discriminator
   */
  public discriminator!: string;

  /**
   * The member avatar
   */
  public avatar!: string;

  /**
   * The member tag
   */
  public tag!: string;

  private _token: string;
  private guildID!: string;

  constructor(messageData: object | any, token: string, guildID: string) {
    this._token = token;
    this.guildID = guildID;
    this._patchData(messageData);
  }

  /**
   * Get the webhook avatar URL
   * @param {AvatarURL} options
   * @returns {string|undefined}
   * @example
   * console.log(webhook.avatarURL({
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

  public async addRole(roleID: string) {
    if (!roleID || typeof roleID !== 'string') throw new SyntaxError('NO_ROLE_ID_PROVIDED_OR_INVALID_ROLE_ID');
    await RestManager.prototype.REQUEST(`${DISCORD_API}guilds/${this.guildID}/members/${this.id}/roles/${roleID}`, {
      token: this._token,
      method: 'PUT',
    });
  }

  public stringifiedRoles(): string {
    return JSON.stringify(this.roles);
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any): Promise<void> {
    this.id = data.user.id;
    this.username = data.user.username;
    this.avatar = data.user.avatar;
    this.discriminator = data.user.discriminator;
    this.tag = `${this.username}#${this.discriminator}`;
    this.roles = data.roles;
  }
}
