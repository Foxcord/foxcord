import moment from 'moment';

import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { Channel } from './Channel';
import { DiscordEmbed } from './DiscordEmbed';
import { _isEmoji } from '../utils/Utils';
import { GuildMember } from '../structures/GuildMember';
import { MessageOptionsEdit } from '../utils/Interfaces';

/**
 * CLass symbolizing a `SentMessage`
 * @class
 */
export class SentMessage {
  /**
   * The message channel
   */
  public channel!: Channel;

  /**
   * The message content
   */
  public content!: string;

  /**
   * The message author
   */
  public author!: GuildMember;

  /**
   * The message ID
   */
  public id!: string;

  /**
   * The message timestamp
   */
  public timestamp!: string;

  /**
   * The message formated timestamp
   */
  public formatedTimestamp!: number;

  /**
   * Is the message `Text To Speech`
   */
  public tts!: boolean;

  /**
   * Is the message pinned ?
   */
  public pinned!: boolean;

  /**
   * Message mentions **(users/bots only)**
   */
  public mentions!: string[] | [];

  /**
   * Message mentions **(roles only)**
   */
  public mentionsRoles!: string[] | [];

  /**
   * Message components
   */
  public components!: string[] | [];

  /**
   * Message embeds
   */
  public embeds!: string[] | [];

  /**
   * Message `@everyone` mention
   */
  public mentionEveryone!: boolean;

  /**
   * Message edited timestamp *(null if new message)*
   */
  public editedTimestamp!: any;

  /**
   * Message attachments
   */
  public attachments!: any[] | [];

  private _token: string;

  /**
   * Create a new SentMessage
   * @constructor
   * @param {any} data
   * @param {string} token
   */
  constructor(data: any, token: string) {
    this._token = token;
    this._patchData(JSON.parse(data));
  }

  /**
   * Delete the sent message
   * @returns {Promise<void>}
   * @example message.delete();
   */
  async delete(): Promise<void> {
    return await RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/messages/${this.id}`, {
      token: this._token,
      method: 'DELETE',
    });
  }

  /**
   * Edit the sent message
   * @param {string|MessageEmbed} message
   * @param {MessageOptionsEdit} options
   * @returns {Promise<void>}
   * @example message.edit('some edit');
   */
  public async edit(message: string | number | DiscordEmbed, options?: MessageOptionsEdit): Promise<void> {
    if (!message) throw new SyntaxError('[SENT-MESSAGE] No message provided');
    const payload = {
      content: '',
      embeds: [] as any,
      components: [] as any,
    };
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
          throw new Error('[SENT-MESSAGE] Invalid embed');
        }
        break;
      default:
        throw new Error('[SENT-MESSAGE] Invalid content');
    }
    if (options?.button && options.selectMenu) throw new SyntaxError('[SENT-MESSAGE] Too many components');
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
      if (Array.isArray(options.selectMenu)) throw new SyntaxError('[SENT-MESSAGE] Select meny is array');
      payload.components = [
        {
          type: 1,
          components: [options.selectMenu.getJSON()],
        },
      ];
    }
    return await RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/messages/${this.id}`, {
      token: this._token,
      method: 'PATCH',
      data: JSON.stringify(payload),
    });
  }

  /**
   * Pin the sent message
   * @returns {Promise<void>}
   */
  public async pin(): Promise<void> {
    return await RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/pins/messages/${this.id}`, {
      token: this._token,
      method: 'PUT',
    });
  }

  /**
   * Unpin the sent message (if pinned)
   * @returns {Promise<void>}
   */
  public async unpin(): Promise<void> {
    return await RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/pins/messages/${this.id}`, {
      token: this._token,
      method: 'DELETE',
    });
  }

  /**
   * Add emoji to the sent message
   * @param {string} emoji
   * @returns {Promise<void>}
   */
  public async addReaction(emoji: string): Promise<void> {
    if (!emoji || typeof emoji !== 'string') throw new SyntaxError('[SENT-MESSAGE] No emoji provided');
    if (emoji.startsWith('<')) emoji = emoji.replace('<:', '').replace('>', '');
    return await RestManager.prototype.request(
      `${DISCORD_API}channels/${this.channel.id}/messages/${this.id}/reactions/${encodeURIComponent(emoji)}/@me`,
      {
        token: this._token,
        method: 'PUT',
      },
    );
  }

  /**
   * @ignore
   * @private
   * @param {any} data
   * @returns {void}
   */
  private _patchData(data: object | any): void {
    this.channel = new Channel(data.channel_id, data.guild_id, this._token);
    this.content = data.content;
    this.author = new GuildMember(data);
    this.id = data.id;
    this.timestamp = data.timestamp;
    this.formatedTimestamp = Number(moment(data.timestamp).format('LLLL'));
    this.tts = data.tts;
    this.pinned = data.pinned;
    this.mentions = data.mentions;
    this.mentionsRoles = data.mentions_roles;
    this.components = data.components;
    this.embeds = data.embeds;
    this.mentionEveryone = data.mention_everyone;
    this.editedTimestamp = data.edited_timestamp;
    this.attachments = data.attachments;
  }
}
