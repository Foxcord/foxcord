import { EventEmitter } from 'events';

import { Collection } from '../../utils/Collection';
import { Message } from '../Message';
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

interface CollectorEvents {
    END: [collected: Collection<string, Message>];
    COLLECTED: [message: Message];
}

export declare interface MessageCollector extends EventEmitter {
    on<TKey extends keyof CollectorEvents>(event: TKey, listener: (...args: CollectorEvents[TKey]) => void | Promise<void> | any): this;
    once<TKey extends keyof CollectorEvents>(event: TKey, listener: (...args: CollectorEvents[TKey]) => void | Promise<void> | any): this;
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
        if (!client || (client instanceof Client) === false) throw new SyntaxError('NO_CLIENT_PROVIDED_OR_INVALID_CLIENT_PROVIDED');
        if (!options || !options.channelID || typeof options.channelID !== 'string') throw new SyntaxError('NO_CHANNEL_ID_PROVIDED_OR_INVALID_CHANNEL_ID');
        this.client = client;
        this.filter = filter;
        this.channelID = options.channelID;
        this.collected = new Collection();
        this.awaitMessages();
        setTimeout(() => {
            this.emit('END', this.collected);
            return;
        }, options?.time && typeof options.time === 'number' ? options.time * 1000 : 30000 || 30000)
    };

    private async awaitMessages() {
        this.client.on('MESSAGE', async message => {
            if (message.channel.id !== this.channelID) return;
            if (this.filter(message)) {
                this.collected.set(message.id, message);
                this.emit('COLLECTED', message);
            }
        })
    }
}