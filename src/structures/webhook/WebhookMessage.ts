import moment from 'moment';

import { RestManager } from '../../rest/RestManager';
import { DISCORD_CDN, imageFormat, imageSize } from '../../utils/Constants';
import { _testURL } from '../../utils/Utils';

type ImageSize = '128' | '256' | '512' | '1024';

type ImageFormat = 'jpg' | 'jpeg' | 'gif' | 'png' | 'tiff' | 'bmp';

interface Message {
  /**
   * The sent message ID
   */
  id: string | number;

  /**
   * The sent message content
   */
  content: string;

  /**
   * The sent message timestamp
   */
  timestamp: string;

  /**
   * The sent message timestamp formated using moment
   */
  formatedTimestamp: string | number;
}

interface AvatarURL {
  /**
   * Image size
   * @default 128
   */
  size?: ImageSize;

  /**
   * Image format
   * @default 'png'
   */
  format?: ImageFormat;
}

interface EditOptions {
  /**
   * New webhook username
   */
  username?: string;

  /**
   * New webhook avatar URL
   */
  avatarURL?: string;

  /**
   * Edit timeout?
   */
  timeout?: number;
}

/**
 * Class symbolizing a `WebhookMessage`
 * @class
 */
export class WebhookMessage {
  /**
   * The webhook URL
   */
  public url: string;

  /**
   * The sent message
   */
  public message!: Message;

  /**
   * The webhook channel ID
   */
  public channelID!: string | number;

  /**
   * The webhook is a bot
   */
  public isBot!: boolean;

  /**
   * The ID
   */
  public id!: string | number;

  /**
   * The webhook username
   */
  public username!: string;

  /**
   * The webhook avatar code
   */
  public avatar!: string;

  /**
   * The webhook discriminator (#0000)
   */
  public discriminator!: string | number;

  /**
   * The webhook ID
   */
  public webhookID!: string | number;

  /**
   * The response type
   */
  public type!: string | number;

  private restManager: RestManager;

  /**
   * Create a new WebhookMessage
   * @param {string} webhookURL
   * @param {Object|any} messageData
   * @constructor
   */
  constructor(webhookURL: string, messageData: object | any) {
    this.url = webhookURL;
    this.restManager = new RestManager();
    this._patchData(JSON.parse(messageData));
  }

  /**
   * Delete the sent message **(timeout is optional but in SECONDS)**
   * @param {number} timeout
   * @returns {Promise<void>}
   * @example
   * webhook.delete(5);
   */
  async delete(timeout?: number): Promise<void> {
    if (timeout && typeof timeout === 'number') {
      const deleteTimeout = Number(timeout) * 1000;
      setTimeout(() => {
        this.restManager.REQUEST(this.url, {
          method: 'DELETE',
        });
      }, deleteTimeout);
      return;
    } else {
      this.restManager.REQUEST(this.url, {
        method: 'DELETE',
      });
      return;
    }
  }

  /**
   * Edit the sent message
   * @param {sting|Object} content
   * @returns {Promise<WebhookMessage>}
   * @example
   * webhook.edit({
   *      username: 'Josh', // Username cannot be 'Clyde'
   *      avatarURL: 'https://image.freepik.com/vecteurs-libre/vecteur-fond-ecran-abstrait-dynamique_53876-43459.jpg',
   *      timeout: 5 // in seconds
   * });
   */
  public async edit(options?: EditOptions): Promise<WebhookMessage> {
    if (!options) throw new SyntaxError('NO_OPTIONS_PROVIDED');
    if (!options.username || options.username.toLowerCase() === 'clyde')
      throw new SyntaxError('NO_USERNAME_PROVIDED_OR_INVALID_USERNAME');
    const payload = {
      username: options.username !== undefined ? options.username : null,
      avatar: options.avatarURL !== undefined && _testURL(options.avatarURL) ? options.avatarURL : null,
    };
    if (options.timeout && typeof options.timeout === 'number') {
      const editTimeout = Number(options.timeout) * 1000;
      setTimeout(() => {
        this.restManager.REQUEST(this.url, { method: 'PATCH', data: JSON.stringify(payload) });
      }, editTimeout);
      return this;
    }
    this.restManager.REQUEST(this.url, { method: 'PATCH', data: JSON.stringify(payload) });
    return this;
  }

  /**
   * Get the webhook avatar URL
   * @param {AvatarURL} options
   * @returns {string|undefined}
   * @example
   * console.log(webhook.avatarURL({
   *      format: 'jpg',
   *      size: '1024'
   * }));
   */
  public avatarURL(options?: AvatarURL): string | undefined {
    if (this.avatar === null) return undefined;
    if (!options) return `${DISCORD_CDN}avatars/${this.id}/${this.avatar}`;
    return `${DISCORD_CDN}avatars/${this.id}/${this.avatar}${
      options.format && typeof options.format === 'string' && imageFormat.indexOf(options.format.toLowerCase()) > -1
        ? '.' + options.format
        : '.png'
    }${options.size && imageSize.indexOf(Number(options.size)) > -1 ? '?size=' + options.size : '?size=128'}`;
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(data: object | any): Promise<void> {
    this.id = data.author.id;
    this.type = data.type;
    this.message = {
      id: data.id,
      content: data.content,
      timestamp: data.timestamp,
      formatedTimestamp: moment(data.timestamp).format('LLLL'),
    };
    this.avatar = data.author.avatar;
    this.isBot = data.author.bot;
    this.webhookID = data.webhook_id;
    this.channelID = data.channel_id;
    this.discriminator = data.author.discriminator;
    this.username = data.author.userusername;
  }
}
