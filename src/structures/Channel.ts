import { DiscordEmbed } from './DiscordEmbed';
import { DISCORD_API } from '../utils/Constants';
import { RestManager } from '../rest/RestManager';
import { Guild } from './Guild';
import { SentMessage } from './SentMessage';
import { Client } from '../client/Client';
import { MessageCollector } from '../utils/collectors/MessageCollector';
import { SendOptionsWithFile, CollectorOptions } from '../utils/Interfaces';

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
   * @param {SendOptionsWithFile} options
   * @returns {Promise<SentMessage>}
   */
  public async send(message: string | number | DiscordEmbed, options?: SendOptionsWithFile): Promise<SentMessage> {
    if (!message) throw new SyntaxError('[CHANNEL] No message provided');
    const payload = {
      content: '',
      embeds: [] as any,
      components: [] as any,
    };
    if (options?.files) {
      RestManager.prototype.postFile(`${DISCORD_API}channels/${this.id}/messages`, options.files, {
        token: this._token,
        method: 'POST',
      });
    }
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
          throw new Error('[CHANNEL] INVALID_EMBED');
        }
        break;
      default:
        throw new Error('[CHANNEL] INVALID_CONTENT');
    }
    if (options?.button && options.selectMenu) throw new SyntaxError('[CHANNEL] Too many components');
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
      if (Array.isArray(options.selectMenu)) throw new SyntaxError('[CHANNEL] Select menu is array');
      payload.components = [
        {
          type: 1,
          components: [options.selectMenu.getJSON()],
        },
      ];
    }
    const res: any = await RestManager.prototype.request(`${DISCORD_API}channels/${this.id}/messages`, {
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
    if (!filter || typeof filter !== 'function') throw new SyntaxError('[CHANNEL] No filter provided');
    if (!client) throw new SyntaxError('[CHANNEL] No client provided');
    return new MessageCollector(filter, client, {
      time: options?.time || 30,
      channelID: this.id,
    });
  }
}
