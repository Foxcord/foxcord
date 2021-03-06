import { EventEmitter } from 'events';

import { RestManager } from '../rest/RestManager';
import { DISCORD_API, DISCORD_CDN, imageFormat, imageSize, CLIENT_EVENTS } from '../utils/Constants';
import { Badges } from '../structures/Badges';
import { _testURL } from '../utils/Utils';
import { AvatarURL, ListGuildOptions } from '../utils/Interfaces';

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

  /**
   * The client bio
   */
  public bio!: string;

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
    if (!username || typeof username !== 'string') throw new SyntaxError('[CLIENT-USER] No username provided');
    return await RestManager.prototype.request(`${DISCORD_API}users/@me`, {
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
    if (!avatarURL || typeof avatarURL !== 'string') throw new SyntaxError('[CLIENT-USER] No avatar URL provided');
    if (!_testURL(avatarURL)) throw new Error('[CLIENT-USER] Invalid avatar URL provided');
    return await RestManager.prototype.request(`${DISCORD_API}users/@me`, {
      method: 'PATCH',
      token: this._token,
      data: JSON.stringify({ avatar: avatarURL }),
    });
  }

  /**
   * Get the client guilds list
   * @returns {Promise<Guild[]>}
   */
  public async getGuildsList(): Promise<ListGuildOptions[]> {
    const res = await RestManager.prototype.request(`${DISCORD_API}users/@me/guilds`, {
      method: 'GET',
      token: this._token,
    });
    console.log(JSON.parse(await res));
    return JSON.parse(await res);
  }

  /**
   * Get the bot shards count
   * @deprecated
   * @returns {Promise<number>}
   */
  public async getShardsCount(): Promise<number> {
    const res: any = await RestManager.prototype.request(`${DISCORD_API}gateway/bot`, {
      method: 'GET',
      token: this._token,
    });
    const parsedRes = await JSON.parse(res);
    return parsedRes.shards;
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(): Promise<void> {
    const res: any = await RestManager.prototype.request(`${DISCORD_API}users/@me`, {
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
    this.bio = parsedRes.bio;
    this.emitter.emit(CLIENT_EVENTS.READY);
  }
}
