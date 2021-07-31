import { EventEmitter } from 'events';

import { Collection } from '../Collection';
import { COLLECTOR_EVENTS, CLIENT_EVENTS } from '../Constants';
import { Message } from '../../structures/Message';
import { Client } from '../../client/Client';

interface CollectorOptions {
  /**
   * The collector channel ID
   */
  channelID: string;

  /**
   * Collector time **(in seconds)**
   */
  time?: number;
}

export declare interface MessageCollector extends EventEmitter {
  /**
   * Emitted when the collector collects a message
   * @event MessageCollector#COLLECTED
   */
  on(event: 'COLLECTED', listener: (message: Message) => void | Promise<void>): this;

  /**
   * Emitted when the collector ends
   * @event MessageCollector#END
   */
  on(event: 'END', listener: () => any | Promise<any>): this;
}

/**
 * Class symbolizing a `MessageCollector`
 * @class
 * @extends {EventEmitter}
 */
export class MessageCollector extends EventEmitter {
  /**
   * Collected map
   */
  public collected: Collection<string, Message>;

  /**
   * Collector filter
   */
  public filter: Function;

  /**
   * The collector channel ID
   */
  public channelID: string;

  private client: Client;

  /**
   * Create a new MessageCollector
   * @param {Function} filter
   * @param {Client} client
   * @param {CollectorOptions} options
   * @constructor
   */
  constructor(filter: Function, client: Client, options: CollectorOptions) {
    super();
    if (!filter || typeof filter !== 'function') throw new SyntaxError('NO_FILTER_PROVIDED_OR_INVALID_FILTER');
    if (!client || client instanceof Client === false)
      throw new SyntaxError('NO_CLIENT_PROVIDED_OR_INVALID_CLIENT_PROVIDED');
    if (!options || !options.channelID || typeof options.channelID !== 'string')
      throw new SyntaxError('NO_CHANNEL_ID_PROVIDED_OR_INVALID_CHANNEL_ID');
    this.client = client;
    this.filter = filter;
    this.channelID = options.channelID;
    this.collected = new Collection();
    this.awaitMessages();
    setTimeout(
      () => {
        this.emit(COLLECTOR_EVENTS.END, this.collected);
        return;
      },
      options?.time && typeof options.time === 'number' ? options.time * 1000 : 30000,
    );
    this.on(COLLECTOR_EVENTS.END, () => {
      return this.removeAllListeners();
    });
  }

  /**
   * @ignore
   * @private
   * @return {Promise<void>}
   */
  private async awaitMessages(): Promise<void> {
    this.client.on(CLIENT_EVENTS.MESSAGE, async (message) => {
      if (message.channel.id !== this.channelID) return;
      if (this.filter(message)) {
        this.collected.set(message.id, message);
        this.emit(COLLECTOR_EVENTS.COLLECTED, message);
      }
    });
  }
}
