import { DISCORD_CDN, imageFormat, imageSize } from '../utils/Constants';

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

export class GuildMember {
  public username!: string;
  public discriminator!: string;
  public avatar!: string;
  public id!: string;
  public guildID!: string;

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
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any) {
    this.username = data.user.username;
    this.discriminator = data.user.discriminator;
    this.id = data.user.id;
    this.guildID = data.guild_id;
    this.avatar = data.user.avatar;
  }
}
