import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { Message } from './Message';
import { Member } from './Member';
import { DiscordEmbed } from '../structures/DiscordEmbed';
import { DiscordButton } from '../structures/DiscordButton';
import { DiscordSelectMenu } from './DiscordSelectMenu';

interface SendOptions {
  /**
   * Message button
   */
  button?: DiscordButton | DiscordButton[] | any;

  /**
   * Is the reply ephemeral
   */
  ephemeral?: boolean;

  /**
   * Select menu **(only 1)**
   */
  selectMenu?: DiscordSelectMenu;
}

/**
 * Class symbolizing a `SelectMenuInteraction`
 * @class
 */
export class SelectMenuInteraction {
  /**
   * The guild ID
   */
  public guildID!: string;

  /**
   * The menu ID
   */
  public id!: string;

  /**
   * Thz menu custom ID
   */
  public customID!: string;

  /**
   * The menu token
   */
  public token!: string;

  /**
   * The application ID
   */
  public applicationID!: string;

  /**
   * The menu values
   */
  public values!: string[];

  /**
   * The message
   */
  public message!: Message;

  /**
   * The menu member
   */
  public member!: Member;

  private _token: string;
  private deferred!: boolean;
  private replied!: boolean;

  /**
   * Create a new SelectMenuInteraction
   * @param {object|any} messageData
   * @param {string} token
   * @constructor
   */
  constructor(messageData: object | any, token: string) {
    this._token = token;
    this._patchData(messageData);
  }

  /**
   * Edit the message menu
   * @param {string|number|DiscordEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
   */
  public async edit(message: string | number | DiscordEmbed, options?: SendOptions): Promise<void> {
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
    return await RestManager.prototype.REQUEST(`${DISCORD_API}interactions/${this.id}/${this.token}/callback`, {
      token: this._token,
      data: JSON.stringify({ type: 7, data: payload }),
    });
  }

  public async reply(message: string | number | DiscordEmbed, options?: SendOptions): Promise<void> {
    if (this.deferred === true || this.replied === true) throw new SyntaxError('ALREADY_RESPONDED');
    if (!message) throw new SyntaxError('NO_MESSAGE_PROVIDED');
    const payload = {
      content: '',
      embeds: [] as any,
      components: [] as any,
      flags: options?.ephemeral ? 64 : null,
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
    await RestManager.prototype.REQUEST(`${DISCORD_API}interactions/${this.id}/${this.token}/callback`, {
      token: this._token,
      data: JSON.stringify({ type: 4, data: payload }),
    });
    this.replied = true;
    return;
  }

  /**
   * Defer reply
   * @param {boolean} ephemeral
   * @returns {Promise<void>}
   */
  public async defer(ephemeral?: boolean): Promise<void> {
    if (this.deferred === true || this.replied === true) throw new Error('ALREADY_RESPONDED');
    await RestManager.prototype.REQUEST(`${DISCORD_API}interactions/${this.id}/${this.token}/callback`, {
      token: this._token,
      data: JSON.stringify({ type: 6, data: { flags: ephemeral ? 64 : null } }),
    });
    this.deferred = true;
    return;
  }

  /**
   * Think reply
   * @param {boolean} ephemeral
   * @returns {Promise<void>}
   */
  public async think(ephemeral?: boolean): Promise<void> {
    if (this.deferred === true || this.replied === true) throw new Error('ALREADY_RESPONDED');
    await RestManager.prototype.REQUEST(`${DISCORD_API}interactions/${this.id}/${this.token}/callback`, {
      token: this._token,
      data: JSON.stringify({ type: 5, data: { flags: ephemeral ? 64 : null } }),
    });
    this.deferred = true;
    return;
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: any): Promise<void> {
    this.deferred = false;
    this.replied = false;
    this.guildID = data.guild_id;
    this.customID = data.data.custom_id;
    this.id = data.id;
    this.token = data.token;
    this.values = data.data.values;
    this.applicationID = data.application_id;
    this.member = new Member(data.member, this._token, this.guildID);
    this.message = new Message(data.message, this._token);
  }
}
