import { Badges } from './Badges';
import { DISCORD_API, DISCORD_CDN, imageFormat, imageSize, GATEWAY_OPCODES } from '../utils/Constants';
import { Websocket } from '../websocket/Websocket';
import { VoiceConnection } from '../voice/VoiceConnection';
import { RestManager } from '../rest/RestManager';
import { AvatarURL, VoiceOptions, BannerOptions } from '../utils/Interfaces';

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
   * The author roles
   */
  public roles!: string[];

  private guildID!: string;
  private _token: string;
  private WS!: Websocket;

  /**
   * Create a new Author
   * @param {Object|any} messageData
   * @param {string} token
   * @constructor
   */
  constructor(messageData: object | any, token: string, WS: Websocket) {
    this._token = token;
    this.WS = WS;
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
   * Join the message author voice channel
   * @param {VoiceOptions} state
   */
  public async joinVoiceChannel(channelID: string, state?: VoiceOptions): Promise<VoiceConnection> {
    if (!channelID || typeof channelID !== 'string') throw new SyntaxError('[AUTHOR] No voice channel ID provided');
    await this.WS.sendToWS(GATEWAY_OPCODES.VOICE_STATE_UPDATE, {
      guild_id: this.guildID,
      channel_id: channelID,
      self_mute: state?.mute || false,
      self_deaf: state?.deaf || false,
    });
    const endpoint = await this.WS.getVoiceConnectionEndpoint(this.guildID);
    return new VoiceConnection(this.WS, this.guildID, await endpoint);
  }

  /**
   * Get the author banner URL
   * @param {BannerOptions} options
   * @returns {Promise<string>}
   */
  public async bannerURL(options?: BannerOptions): Promise<string> {
    const res = await RestManager.prototype.REQUEST(`${DISCORD_API}users/${this.id}`, {
      method: 'GET',
      token: this._token,
    });
    return `${DISCORD_CDN}banners/${this.id}/${await JSON.parse(res).banner}.${
      options && options.type && typeof options.type === 'string' ? options.type : 'gif'
    }?size=${options && options.size && imageSize.indexOf(Number(options.size)) > -1 ? String(options.size) : '4096'}`;
  }

  /**
   * Leave voice channel (if connected)
   * @param {Promise<void>}
   */
  public async leaveVoiceChannel(): Promise<void> {
    this.WS.sendToWS(GATEWAY_OPCODES.VOICE_STATE_UPDATE, {
      guild_id: this.guildID,
      channel_id: null,
      self_mute: false,
      self_deaf: false,
    });
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any): Promise<void> {
    this.guildID = data.guild_id;
    this.username = data.author.username;
    this.bot = data.author.bot !== undefined;
    this.id = data.author.id;
    this.discriminator = data.author.discriminator;
    this.avatar = data.author.avatar;
    this.badges = new Badges(data.author.public_flags);
  }
}
