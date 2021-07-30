import moment from 'moment';

import { Channel } from './Channel';
import { Author } from './Author';
import { Websocket } from '../websocket/Websocket';
import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { SentMessage } from './SentMessage';

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
    if (!content || typeof content !== 'string') throw new SyntaxError('NO_CONTENT_PROVIDED_OR_INVALID_CONTENT');
    const payload = {
      content: content,
      message_reference: { message_id: this.id, channel_id: this.channel.id, guild_id: this.channel.guild.id },
    };
    const res: any = RestManager.prototype.REQUEST(`${DISCORD_API}channels/${this.channel.id}/messages`, {
      token: this._token,
      data: JSON.stringify(payload)
    });
    return new SentMessage(await res, this._token);
  };

  /**
   * Inline reply to the message without mention the author
   * @param {string} content 
   * @returns {Promise<SentMessage>}
   */
  public async inlineReplyNoMention(content: string): Promise<SentMessage> {
    if (!content || typeof content !== 'string') throw new SyntaxError('NO_CONTENT_PROVIDED_OR_INVALID_CONTENT');
    const payload = {
      content: content,
      message_reference: { message_id: this.id, channel_id: this.channel.id, guild_id: this.channel.guild.id },
      allowed_mentions: { replied_user: false }
    };
    const res: any = RestManager.prototype.REQUEST(`${DISCORD_API}channels/${this.channel.id}/messages`, {
      token: this._token,
      data: JSON.stringify(payload)
    });
    return new SentMessage(await res, this._token);
  };

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any): Promise<void> {
    this.channel = new Channel(data.channel_id, this._token, data.guild_id !== undefined ? data.guild_id : null);
    this.author = new Author(data, this._token, this.WS);
    this.content = data.content;
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
