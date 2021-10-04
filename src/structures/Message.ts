import moment from 'moment';

import { Channel } from './Channel';
import { Author } from './Author';
import { Websocket } from '../websocket/Websocket';
import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { SentMessage } from './SentMessage';
import { CreateThreadOptions, MessageMentions } from '../utils/Interfaces';

/**
 * Class symbolizing a `Message`
 * @class
 */
export class Message {
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
  public author!: Author;

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
  public mentions!: MessageMentions[] | undefined;

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
  private WS!: Websocket;

  /**
   * Create a new Message
   * @param {Object | any} messageData
   * @constructor
   */
  constructor(messageData: object | any, token: string, WS: any) {
    this._token = token;
    this.WS = WS;
    this._patchData(messageData);
  }

  /**
   * Inline reply to the message *(author mention)*
   * @param {string} content
   * @returns {Promise<SentMessage>}
   */
  public async inlineReply(content: string): Promise<SentMessage> {
    if (!content || typeof content !== 'string') throw new SyntaxError('[MESSAGE] No content provided');
    const payload = {
      content: content,
      message_reference: { message_id: this.id, channel_id: this.channel.id, guild_id: this.channel.guild.id },
    };
    const res: any = RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/messages`, {
      token: this._token,
      data: JSON.stringify(payload),
    });
    return new SentMessage(await res, this._token);
  }

  /**
   * Inline reply to the message without mention the author
   * @param {string} content
   * @returns {Promise<SentMessage>}
   */
  public async inlineReplyNoMention(content: string): Promise<SentMessage> {
    if (!content || typeof content !== 'string') throw new SyntaxError('[MESSAGE] No content provided');
    const payload = {
      content: content,
      message_reference: { message_id: this.id, channel_id: this.channel.id, guild_id: this.channel.guild.id },
      allowed_mentions: { replied_user: false },
    };
    const res: any = RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/messages`, {
      token: this._token,
      data: JSON.stringify(payload),
    });
    return new SentMessage(await res, this._token);
  }

  /**
   * Pin the message
   * @returns {Promise<void>}
   */
  public async pin(): Promise<void> {
    return await RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/pins/messages/${this.id}`, {
      token: this._token,
      method: 'PUT',
    });
  }

  /**
   * Create thread from message
   * @param {string} name
   * @param {CreateThreadOptions} options
   * @returns {Promise<void>}
   * @example message.createThread('New thread', { autoArchiveDuration: '1440' });
   */
  public async createThread(name: string, options?: CreateThreadOptions): Promise<void> {
    if (!name || typeof name !== 'string') throw new SyntaxError('[MESSAGE] No thread name provided');
    return await RestManager.prototype.request(
      `${DISCORD_API}channels/${this.channel.id}/messages/${this.id}/threads`,
      {
        token: this._token,
        method: 'POST',
        data: JSON.stringify({
          name: name,
          auto_archive_duration:
            options && options.autoArchiveDuration && typeof options.autoArchiveDuration === 'string'
              ? Number(options.autoArchiveDuration)
              : 1440,
        }),
      },
    );
  }

  /**
   * Unpin the messahe (if pinned)
   * @returns {Promise<void>}
   */
  public async unpin(): Promise<void> {
    return await RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/pins/messages/${this.id}`, {
      token: this._token,
      method: 'DELETE',
    });
  }

  /**
   * Add emoji to the message
   * @param {string} emoji
   * @returns {Promise<void>}
   */
  public async addReaction(emoji: string): Promise<void> {
    if (!emoji || typeof emoji !== 'string') throw new SyntaxError('[MESSAGE] No emoji provided');
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
   * Reply to the message
   * @param {string} message
   * @returns {Promise<SentMessage>}
   */
  public async reply(message: string): Promise<SentMessage> {
    if (!message) throw new SyntaxError('[MESSAGE] No message provided');
    message = `<@${this.author.id}> ${message}`;
    const res: any = await RestManager.prototype.request(`${DISCORD_API}channels/${this.channel.id}/messages`, {
      token: this._token,
      data: JSON.stringify({ content: message }),
    });
    return new SentMessage(await res, this._token);
  }

  /**
   * @ignore
   * @private
   * @param {any} data
   * @returns {void}
   */
  private _patchData(data: any): void {
    console.log(data);
    this.channel = new Channel(data.channel_id, this._token, data.guild_id !== undefined ? data.guild_id : null);
    this.author = new Author(data, this._token, this.WS);
    this.content = data.content;
    this.id = data.id;
    this.timestamp = data.timestamp;
    this.formatedTimestamp = Number(moment(data.timestamp).format('LLLL'));
    this.tts = data.tts;
    this.pinned = data.pinned;
    this.mentions = Object.keys(data.mentions).length === 0 ? undefined : data.mentions;
    this.mentionsRoles = data.mentions_roles;
    this.components = data.components;
    this.embeds = data.embeds;
    this.mentionEveryone = data.mention_everyone;
    this.editedTimestamp = data.edited_timestamp;
    this.attachments = data.attachments;
  }
}
