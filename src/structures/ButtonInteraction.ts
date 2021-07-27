import { RestManager } from '../rest/RestManager';
import { DISCORD_API } from '../utils/Constants';
import { Message } from './Message';
import { Member } from './Member';
import { DiscordEmbed } from './DiscordEmbed';
import { DiscordButton } from './DiscordButton';
import { DiscordSelectMenu } from './DiscordSelectMenu';
import { Websocket } from '../websocket/Websocket';

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
 * Class symbolizing a `ButtonInteraction`
 * @class
 */
export class ButtonInteraction {
  /**
   * The guild ID
   */
  public guildID!: string;

  /**
   * The button ID
   */
  public id!: string;

  /**
   * Thz button custom ID
   */
  public customID!: string;

  /**
   * The button token
   */
  public token!: string;

  /**
   * The application ID
   */
  public applicationID!: string;

  /**
   * The message
   */
  public message!: Message;

  /**
   * The button member
   */
  public member!: Member;

  private _token: string;
  private deferred!: boolean;
  private replied!: boolean;
  private WS!: Websocket;

  /**
   * Create a new ButtonInteraction
   * @param {object|any} messageData
   * @param {string} token
   * @constructor
   */
  constructor(messageData: object | any, token: string, WS: any) {
    this._token = token;
    this.WS = WS;
    this._patchData(messageData);
  }

  /**
   * Edit the message button
   * @param {string|number|DiscordEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
   */
  public async edit(message: string | number | DiscordEmbed, options?: SendOptions): Promise<void> {
    if (!message) throw new SyntaxError('ERRUR ICI');
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
    this.message = new Message(data.message, this._token, this.WS);
    this.member = new Member(data.member, this._token, this.guildID);
    this.deferred = false;
    this.replied = false;
    this.guildID = data.guild_id;
    this.customID = data.data.custom_id;
    this.id = data.id;
    this.token = data.token;
    this.applicationID = data.application_id;
  }
}
