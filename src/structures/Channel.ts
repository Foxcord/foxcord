import { DiscordEmbed } from './DiscordEmbed';
import { DISCORD_API } from '../utils/Constants';
import { RestManager } from '../rest/RestManager';
import { DiscordButton } from './DiscordButton';
import { DiscordSelectMenu } from './DiscordSelectMenu';
import { Guild } from './Guild';
import { SentMessage } from './SentMessage';
import { Client } from '../client/Client';
import { MessageCollector } from './collectors/MessageCollector';

interface SendOptions {
  /**
   * File or file array
   */
  files?: string | string[];

  /**
   * Button or button array
   */
  button?: DiscordButton | DiscordButton[] | any;

  /**
   * Discord select menu **(only 1)**
   */
  selectMenu?: DiscordSelectMenu;
}

interface CollectorOptions {
  /**
   * Collector time **(in seconds)**
   */
  time?: number;
}

/**
 * Class symbolizing a `Channel`
 * @class
 */
export class Channel {
  /**
   * The channel ID
   */
  public id!: string;

  /**
   * Thc channel guild
   */
  public guild!: Guild;

  private _token: string;

  /**
   * Create a new Channel
   * @param {string} id
   * @param {string} token
   * @constructor
   */
  constructor(id: string, token: string, guildID?: string) {
    this._token = token;
    this.id = id;
    if (guildID !== undefined) this.guild = new Guild(guildID, this._token);
  }

  /**
   * Send a message to the channel
   * @param {string|number|DiscordEmbed} message
   * @param {SendOptions} options
   * @returns {Promise<void>}
   */
  public async send(message: string | number | DiscordEmbed, options?: SendOptions): Promise<SentMessage> {
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
    if (options?.files) {
      const res: any = await RestManager.prototype.POSTFILE(
        `${DISCORD_API}channels/${this.id}/messages`,
        Array.isArray(options.files) ? options.files.map((el) => el) : options.files,
        payload.content,
        payload.embeds,
        payload.components,
        {
          token: this._token,
          data: JSON.stringify(payload),
        },
      );
      return new SentMessage(await res, this._token);
    }
    const res: any = await RestManager.prototype.REQUEST(`${DISCORD_API}channels/${this.id}/messages`, {
      token: this._token,
      data: JSON.stringify(payload),
    });
    return new SentMessage(await res, this._token);
  }

  /**
   * Create a MessageCollector
   * @param {Function} filter 
   * @param {Client} client 
   * @param {CollectorOptions} options 
   * @returns {MessageCollector}
   */
  public createMessageCollector(filter: Function, client: Client, options?: CollectorOptions): MessageCollector {
    if (!filter || typeof filter !== 'function') throw new SyntaxError('NO_FILTER_PROVIDED_OR_INVALID_FILTER');
    if (!client || (client instanceof Client) === false) throw new SyntaxError('NO_CLIENT_PROVIDED_OR_INVALID_CLIENT_PROVIDED');
    return new MessageCollector(filter, client, {
      time: options?.time || 30,
      channelID: this.id
    });
  }
}
