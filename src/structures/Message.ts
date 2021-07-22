import moment from 'moment';

import { Channel } from './Channel';
import { Author } from './Author';
import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';

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

  /**
   * Create a new Message
   * @param {Object | any} messageData
   * @constructor
   */
  constructor(messageData: object | any, token: string) {
    this._token = token;
    this._patchData(messageData);
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any): Promise<void> {
    this.channel = new Channel(data.channel_id, this._token, data.guild_id !== undefined ? data.guild_id : null);
    this.author = new Author(data, this._token);
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
    this.attachements = data.attachements;
  }
}
