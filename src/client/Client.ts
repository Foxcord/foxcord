import { EventEmitter } from 'events';

import { Websocket } from '../websocket/Websocket';
import { INTENTS_ARRAY, GATEWAY_OPCODES, gameType, numberGameType, statusType } from '../utils/Constants';
import { Users } from '../structures/Users';
import { _testURL, _checkForUpdates } from '../utils/Utils';
import { Message } from '../structures/Message';
import { ButtonInteraction } from '../structures/ButtonInteraction';
import { ClientUser } from './ClientUser';
import { GuildMember } from '../structures/GuildMember';
import { Channels } from '../structures/Channels';
import { SlashCommandInteraction } from '../structures/slashCommands/SlashCommandInteraction';
import { SelectMenuInteraction } from '../structures/SelectMenuInteraction';
import { Messages } from '../structures/Messages';
import { Guilds } from '../structures/Guilds';
import { MessageReaction } from '../structures/MessageReaction';
import { StatusType, GameOptions, ClientOptions, ClientGame } from '../utils/Interfaces';

export declare interface Client extends EventEmitter {
  /**
   * Emitted when the client receives a message
   * @param {Message} listener
   * @event Client#MESSAGE
   */
  on(event: 'MESSAGE', listener: (message: Message) => void | Promise<void>): this;

  /**
   * Emitted when a slash command is used
   * @param {SlashCommandInteraction} listener
   * @event Client#SLASH_COMMAND_USED
   */
  on(event: 'SLASH_COMMAND_USED', listener: (interaction: SlashCommandInteraction) => void | Promise<void>): this;

  /**
   * Emitted when a button is clicked
   * @param {ButtonInteraction} listener
   * @event Client#BUTTON_CLICKED
   */
  on(event: 'BUTTON_CLICKED', listener: (button: ButtonInteraction) => void | Promise<void>): this;

  /**
   * Emitted when the client is ready
   * @event Client#READY
   */
  on(event: 'READY', listener: () => void): this;

  /**
   * Emitted when an error occures
   * @param {Error} listener
   * @event Client#ERROR
   */
  on(event: 'ERROR', listener: (error: Error) => void): this;

  /**
   * Emitted when a warn occured
   * @event Client#WARN
   */
  on(event: 'WARN', listener: (warn: string) => void): this;

  /**
   * Emitted when a member joins a guild
   * @param {GuildMember} listener
   * @event Client#GUILD_MEMBER_ADD
   */
  on(event: 'GUILD_MEMBER_ADD', listener: (member: GuildMember) => void | Promise<void>): this;

  /**
   * Emitted when a select menu is clicked
   * @param {SelectMenuInteraction} listener
   * @event Client#SELECT_MENU_CLICKED
   */
  on(event: 'SELECT_MENU_CLICKED', listener: (selectMenu: SelectMenuInteraction) => void | Promise<void>): this;

  /**
   * Emitted when the client is trying to reconnect itself
   * @param {string} listener
   * @event Client#RECONNECTING
   */
  on(event: 'RECONNECTING', listener: (statusCode: string) => void): this;

  /**
   * Emitted when a reaction is added to a message
   * @param {MessageReaction} listener
   * @event Client#MESSAGE_REACTION_ADD
   */
  on(event: 'MESSAGE_REACTION_ADD', listener: (reaction: MessageReaction) => void | Promise<void>): this;
}

/**
 * Class symbolizing a Client
 * @class
 * @extends {EventEmitter}
 */
export class Client extends EventEmitter {
  /**
   * Client users
   */
  public users!: Users;

  /**
   * Client messages
   */
  public messages!: Messages;

  /**
   * Client game
   */
  public game: ClientGame;

  /**
   * Client status
   */
  public status: string;

  /**
   * Client user
   */
  public user!: ClientUser;

  /**
   * Client channels
   */
  public channels!: Channels;

  /**
   * Client guilds
   */
  public guilds!: Guilds;

  private _token!: string;
  private WS!: Websocket;

  /**
   * Create a new Client
   * @param {ClientOptions} options
   * @constructor
   */
  constructor(options?: ClientOptions) {
    super();
    this.WS = new Websocket(this);
    this.status = 'online';
    this.game = { name: '', type: 0, url: '' };
    this._patchData(options);
  }

  /**
   * Connect the bot using its token
   * @param {string} token The Discord bot token
   * @returns {Promise<void>}
   */
  public async connect(token: string): Promise<void> {
    if (!token || typeof token !== 'string') throw new SyntaxError('[CLIENT] No token provided');
    if (token.length !== 59) throw new SyntaxError('[CLIENT] Invalid token provided');
    this.user = new ClientUser(token, this);
    this._token = token;
    this.users = new Users(this._token);
    this.channels = new Channels(this._token);
    this.messages = new Messages(this._token);
    this.guilds = new Guilds(this._token);
    await this.WS.initConnection(token, this);
  }

  /**
   * Set the client game
   * @param {string} game The game name
   * @param {GameOptions} options Game options *(`type` and `url`)*
   * @returns {Promise<ClientGame>}
   * @example
   * client.setGame('coded using Foxcord', { type: 'WATCHING' });
   */
  public async setGame(game: string, options?: GameOptions): Promise<ClientGame> {
    if (!game || typeof game !== 'string') throw new SyntaxError('[CLIENT] No game provided');
    this.game = {
      name: game,
      type:
        options?.type && typeof options.type === 'string' && gameType.indexOf(options.type.toUpperCase()) > -1
          ? numberGameType.find((el) => el.type === options.type?.toUpperCase())?.number
          : 0,
      url:
        options?.url &&
        _testURL(options.url) &&
        (/https:\/\/www\.twitch\.tv\/(\w+)/.test(options.url) ||
          /https:\/\/www\.youtube\.com\/channel\/(\w+)/.test(options.url))
          ? options.url
          : undefined,
    };
    if (this.WS.online === true)
      await this.WS.sendToWS(GATEWAY_OPCODES.PRESENCE_UPDATE, await this.WS.getMetaData(3, this));
    return this.game;
  }

  /**
   * Set the client status
   * @param {StatusType} status The status. Available statuses :
   * * ONLINE
   * * IDLE
   * * DND
   * * INVISIBLE
   * @return {Promise<void>}
   * @example
   * client.setStatus('IDLE');
   */
  public async setStatus(status: StatusType): Promise<void> {
    if (!status || typeof status !== 'string') throw SyntaxError('[CLIENT] No status provided');
    if (!statusType.includes(status.toUpperCase())) throw new SyntaxError('[CLIENT] Invalid status provided');
    this.status = status.toLowerCase();
    if (this.WS.online === true)
      await this.WS.sendToWS(GATEWAY_OPCODES.PRESENCE_UPDATE, await this.WS.getMetaData(3, this));
  }

  /**
   * Set/remove the client AFK
   * @param {boolean} state
   * @return {Promise<void>}
   * @example
   * client.setAFK(true);
   */
  public async setAFK(state?: boolean): Promise<void> {
    if ((this.WS.AFK === true && state === true) || (this.WS.AFK === false && state === false))
      throw new Error('[CLIENT] This status is already in use');
    this.WS.AFK = state && typeof state === 'boolean' ? state : this.WS.AFK === true ? false : true;
    await this.WS.sendToWS(GATEWAY_OPCODES.PRESENCE_UPDATE, await this.WS.getMetaData(3, this));
  }

  /**
   * The client ping
   * @returns {number}
   */
  public get ping(): number {
    return Number(this.WS.ping);
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(options: ClientOptions | undefined): Promise<void> {
    switch (options?.device?.toUpperCase()) {
      case 'MOBILE':
        this.WS.wsProperties.browser = 'Discord iOS';
        break;
      case 'DESKTOP':
        this.WS.wsProperties.browser = 'win32';
        break;
      default:
        this.WS.wsProperties.browser = process.platform;
        break;
    }
    options?.reconnect && typeof options.reconnect === 'boolean'
      ? (this.WS.wsProperties.reconnect = options.reconnect)
      : true;
    options?.compress && typeof options.compress === 'boolean'
      ? (this.WS.wsProperties.compress = options.compress)
      : true;
    options?.largeThreshold && typeof options.largeThreshold === 'number'
      ? (this.WS.wsProperties.largeThreshold = options.largeThreshold)
      : 250;
    options?.shards && typeof options.shards === 'number' ? (this.WS.wsProperties.shards = options.shards) : 1;
    if (!options?.intents || options.intents.map((el) => el.toUpperCase()).includes('ALL')) this.WS.intents = 65534;
    else
      this.WS.intents = INTENTS_ARRAY.map((elm) =>
        options.intents?.map((el) => el.toUpperCase()).includes(elm.intent) ? elm.number : 0,
      ).reduce((a, b) => a + b);
    // _checkForUpdates();
  }
}
