import moment from 'moment';

import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { Channel } from './Channel';
import { Author } from './Author';
import { DiscordEmbed } from './DiscordEmbed';
import { DiscordButton } from './DiscordButton';
import { DiscordSelectMenu } from './DiscordSelectMenu';

interface MessageOptions {
  /**
   * Button or button array
   */
  button?: DiscordButton | DiscordButton[];

  /**
   * Message menu (don't add a menu if the message already contains one)
   */
  selectMenu?: DiscordSelectMenu;
}

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
    return await RestManager.prototype.REQUEST(`${DISCORD_API}channels/${this.channel.id}/messages/${this.id}`, {
      token: this._token,
      method: 'DELETE',
    });
  }

  /**
   * Edit the sent message
   * @param {string|MessageEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
   * @example message.edit('some edit');
   */
  public async edit(message: string | number | DiscordEmbed, options?: MessageOptions): Promise<void> {
    if (!message) throw new SyntaxError('NO_MESSAGE_PROVIDED');
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
          throw new SyntaxError('INVALID_EMBED');
        }
        break;
      default:
        throw new SyntaxError('INVALID_CONTENT');
    }
    if (options?.button && options.selectMenu) throw new SyntaxError('TOO_MANY_COMPONENTS');
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
      if (Array.isArray(options.selectMenu)) throw new SyntaxError('SELECT_MENU_IS_ARRAY');
      payload.components = [
        {
          type: 1,
          components: [options.selectMenu.getJSON()],
        },
      ];
    }
    return await RestManager.prototype.REQUEST(`${DISCORD_API}channels/${this.channel.id}/messages/${this.id}`, {
      token: this._token,
      method: 'PATCH',
      data: JSON.stringify(payload),
    });
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any): Promise<void> {
    this.channel = new Channel(data.channel_id, data.guild_id, this._token);
    this.content = data.content;
    this.author = new Author(data, this._token);
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
