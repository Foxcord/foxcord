import { EventEmitter } from 'events';

import { RestManager } from '../rest/RestManager';
import { DISCORD_API, DISCORD_CDN, imageFormat, imageSize, CLIENT_EVENTS } from '../utils/Constants';
import { Badges } from '../structures/Badges';
import { _testURL } from '../utils/Utils';

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
 * Class symbolozing a `ClientUser`
 * @class
 */
export class ClientUser {
  /**
   * Client ID
   */
  public id!: string;

  /**
   * Client username
   */
  public username!: string;

  /**
   * Client discriminator
   */
  public discriminator!: string;

  /**
   * Client Avatar
   */
  public avatar!: string;

  /**
   * This is actually true lmao
   */
  public bot!: boolean;

  /**
   * Is the client MFA enable
   */
  public mfaEnable!: boolean;

  /**
   * The client locale
   */
  public locale!: string;

  /**
   * The client locale
   */
  public verified!: string;

  /**
   * Client badges
   */
  public badges!: Badges;

  /**
   * The client tag
   */
  public tag!: string;

  private _token: string;
  private emitter: EventEmitter;

  /**
   * Create a new ClientUser
   * @param {string} token
   */
  constructor(token: string, emitter: EventEmitter) {
    this._token = token;
    this.emitter = emitter;
    this._patchData();
  }

  /**
   * Get the client avatar URL
   * @param {AvatarURL} options
   * @returns {string|undefined}
   * @example
   * console.log(client.user.avatarURL({
   *      format: 'jpg',
   *      size: '1024'
   * }));
   */
  public avatarURL(options?: AvatarURL): string | undefined {
    if (this.avatar === null || !this.avatar) return undefined;
    if (!options) return `${DISCORD_CDN}avatars/${this.id}/${this.avatar}.png`;
    return `${DISCORD_CDN}avatars/${this.id}/${this.avatar}${
      options.format && typeof options.format === 'string' && imageFormat.indexOf(options.format.toLowerCase()) > -1
        ? '.' + options.format
        : '.png'
    }${options.size && imageSize.indexOf(Number(options.size)) > -1 ? '?size=' + options.size : '?size=128'}`;
  }

  /**
   * Set the client username
   * @param {string} username
   * @returns {Promise<void>}
   */
  public async setUsername(username: string): Promise<void> {
    if (!username || typeof username !== 'string') throw new SyntaxError('NO_USERNAME_PROVIDED_OR_INVALID_USERNAME');
    return await RestManager.prototype.REQUEST(`${DISCORD_API}users/@me`, {
      method: 'PATCH',
      token: this._token,
      data: JSON.stringify({ username: username }),
    });
  }

  /**
   * Set the client avatar
   * @param {string} avatarURL The avatar URL, **no image directory**
   * @returns {Promise<void>}
   */
  public async setAvatar(avatarURL: string): Promise<void> {
    if (!avatarURL || typeof avatarURL !== 'string') throw new SyntaxError('NO_USERNAME_PROVIDED_OR_INVALID_USERNAME');
    if (!_testURL(avatarURL)) throw new Error('INVALID_NEW_AVATAR_URL');
    return await RestManager.prototype.REQUEST(`${DISCORD_API}users/@me`, {
      method: 'PATCH',
      token: this._token,
      data: JSON.stringify({ avatar: avatarURL }),
    });
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(): Promise<void> {
    const res: any = await RestManager.prototype.REQUEST(`${DISCORD_API}users/@me`, {
      token: this._token,
      method: 'GET',
    });
    const parsedRes = JSON.parse(res);
    this.id = parsedRes.id;
    this.username = parsedRes.username;
    this.discriminator = parsedRes.discriminator;
    this.avatar = parsedRes.avatar;
    this.bot = parsedRes.bot;
    this.verified = parsedRes.verified;
    this.locale = parsedRes.locale;
    this.mfaEnable = parsedRes.mfa_enable;
    this.badges = new Badges(parsedRes.public_flags);
    this.tag = `${this.username}#${this.discriminator}`;
    this.emitter.emit(CLIENT_EVENTS.READY);
  }
}
