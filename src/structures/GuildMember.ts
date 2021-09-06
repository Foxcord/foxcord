import { DISCORD_CDN, imageFormat, imageSize } from '../utils/Constants';
import { AvatarURL } from '../utils/Interfaces';

/**
 * Class symbolizing a `GuildMember`
 * @class
 */
export class GuildMember {
  /**
   * Member username
   */
  public username!: string;

  /**
   * Member discriminator
   */
  public discriminator!: string;

  /**
   * Member avatar
   */
  public avatar!: string;

  /**
   * Member ID
   */
  public id!: string;

  /**
   * Member guild ID
   */
  public guildID!: string;

  /**
   * Create a new GuildMember
   * @param {object} messageData
   * @constructor
   */
  constructor(messageData: object) {
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

  /**
   * @ignore
   * @private
   * @param {any} data
   * @returns {void}
   */
  private _patchData(data: any): void {
    if (data.user !== undefined) {
      this.username = data.user.username;
      this.discriminator = data.user.discriminator;
      this.id = data.user.id;
      this.guildID = data.guild_id;
      this.avatar = data.user.avatar;
    } else if (data.author !== undefined) {
      this.username = data.author.username;
      this.discriminator = data.author.discriminator;
      this.id = data.author.id;
      this.guildID = data.guild_id;
      this.avatar = data.author.avatar;
    }
  }
}
