import { Badges } from './Badges';
import { DISCORD_CDN, DISCORD_API, imageFormat, imageSize } from '../utils/Constants';
import { RestManager } from '../rest/RestManager';

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

/**
 * Class symbolizing an `Author`
 * @class
 */
export class Author {
  /**
   * Message author username
   */
  public username!: string;

  /**
   * Message author ID
   */
  public id!: string;

  /**
   * Message author discriminator
   */
  public discriminator!: string;

  /**
   * Message author avatar
   */
  public avatar!: string;

  /**
   * Message author badges
   */
  public badges!: Badges;

  /**
   * Message author voice channel ID
   */
  public voiceChannelID!: string;

  /**
   * Bot?
   */
  public bot!: boolean;

  /**
   * Message author voice ?
   */
  public voice: boolean;

  private guildID!: string;
  private _token: string;
  public RestManager: RestManager;

  /**
   * Create a new Author
   * @param {Object|any} messageData
   * @param {string} token
   * @constructor
   */
  constructor(messageData: object | any, token: string) {
    this._token = token;
    this.voice = false;
    this._patchData(messageData);
    this.RestManager = new RestManager();
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
  private async _patchData(data: object | any): Promise<void> {
    this.voiceChannelID = data.channel_id;
    this.guildID = data.guild_id;
    this.username = data.author.username;
    this.bot = data.author.bot !== undefined;
    this.id = data.author.id;
    this.discriminator = data.author.discriminator;
    this.avatar = data.author.avatar;
    this.badges = new Badges(data.author.public_flags);
  }
}
