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
import { SlashCommandInteraction } from '../structures/SlashCommandInteraction';
import { SelectMenuInteraction } from '../structures/SelectMenuInteraction';
import { Messages } from '../structures/Messages';
import { Guilds } from '../structures/Guilds';

type DeviceType = 'MOBILE' | 'DESKTOP';
type IntentsOptions =
  | 'ALL'
  | 'GUILD_MEMBERS'
  | 'GUILD_BANS'
  | 'GUILD_EMOJIS'
  | 'GUILD_INTEGRATIONS'
  | 'GUILD_WEBHOOKS'
  | 'GUILD_INVITES'
  | 'GUILD_VOICE_STATES'
  | 'GUILD_PRESENCES'
  | 'GUILD_MESSAGES'
  | 'GUILD_MESSAGE_REACTIONS'
  | 'GUILD_MESSAGE_TYPING'
  | 'DIRECT_MESSAGES'
  | 'DIRECT_MESSAGE_REACTIONS'
  | 'DIRECT_MESSAGE_TYPING';
type GameType = 'PLAYING' | 'WATCHING' | 'STREAMING' | 'LISTENING' | 'COMPETING';
type StatusType = 'ONLINE' | 'IDLE' | 'DND' | 'INVISIBLE';

interface ClientGame {
  /**
   * The client game
   */
  name: string | undefined;

  /**
   * The client game URL *(url is required for streaming status)*
   */
  url?: string;

  /**
   * The client game type
   * @default 'PLAYING'
   */
  type?: number;
}

interface GameOptions {
  /**
   * The client game URL *(url is required for streaming status)*
   */
  url?: string;

  /**
   * The client game type
   * @default 'PLAYING'
   */
  type?: GameType;
}

interface ClientOptions {
  /**
   * The client device type
   * @default 'DESKTOP'
   */
  device?: DeviceType;

  /**
   * If the client reconnect itself
   * @default false
   */
  reconnect?: boolean;

  /**
   * Compress
   * @default true
   */
  compress?: boolean;

  /**
   * Large threshold
   * @default 250
   */
  largeThreshold?: number;

  /**
   * Intents you may wanted
   * @default 'ALL'
   */
  intents?: IntentsOptions[];
}

interface ClientEvents {
  MESSAGE: [message: Message];
  SLASH_COMMAND_USED: [interaction: SlashCommandInteraction];
  BUTTON_CLICKED: [button: ButtonInteraction];
  READY: [];
  ERROR: [error: Error];
  WARN: [warn: string];
  GUILD_MEMBER_ADD: [member: GuildMember];
  SELECT_MENU_CLICKED: [selectMenu: SelectMenuInteraction];
  RECONNECTING: [statusCode: string];
}

export declare interface Client extends EventEmitter {
  on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void | Promise<void>): this;
  once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void | Promise<void>): this;
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
    if (!token || typeof token !== 'string') throw new SyntaxError('NO_TOKEN_PROVIDED');
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
    if (!game || typeof game !== 'string') throw new SyntaxError('NO_GAME_PROVIDED');
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
    if (!status || typeof status !== 'string') throw SyntaxError('NO_STATUS_PROVIDED');
    if (!statusType.includes(status.toUpperCase())) throw new SyntaxError('INVALID_STATUS');
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
      throw new SyntaxError('THIS_STATUS_IS_ALREADY_IN_USE');
    this.WS.AFK = state && typeof state === 'boolean' ? state : this.WS.AFK === true ? false : true;
    await this.WS.sendToWS(GATEWAY_OPCODES.PRESENCE_UPDATE, await this.WS.getMetaData(3, this));
  }

  public get ping() {
    return Number(this.WS.ping);
  }

  /**
   * @ignore
   * @private
   * @returns {Promise<void>}
   */
  private async _patchData(options: ClientOptions | undefined) {
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
    if (!options?.intents || options.intents.map((el) => el.toUpperCase()).includes('ALL')) this.WS.intents = 65534;
    else
      this.WS.intents = INTENTS_ARRAY.map((elm) =>
        options.intents?.map((el) => el.toUpperCase()).includes(elm.intent) ? elm.number : 0,
      ).reduce((a, b) => a + b);
    // _checkForUpdates();
  }
}
