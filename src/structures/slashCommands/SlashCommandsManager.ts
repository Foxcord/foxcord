import { DISCORD_API } from '../../utils/Constants';
import { RestManager } from '../../rest/RestManager';
import { SlashCommand } from './SlashCommand';
import { SlashCommandBuilder } from './SlashCommandBuilder';
import { Collection } from '../../utils/Collection';
import { PushLoadedOptions, SlashCommandOptionsManager, SlashCommandOptionsWithId } from '../../utils/Interfaces';

/**
 * Class symbolizing a `SlashCommandsManager`
 * @class
 */
export class SlashCommandsManager {
  /**
   * The client ID
   */
  public id: string;

  private _token: string;
  private guildID: string | undefined;
  private loaded: Collection<string, SlashCommandBuilder | object> = new Collection();

  /**
   * Create a new SlashCommandsManager
   * @param {string} id
   * @param {string} token
   */
  constructor(id: string, token: string) {
    if (!id || typeof id !== 'string') throw new SyntaxError('[SLASH-COMMAND-MANAGER] No client id provided');
    if (!token || typeof token !== 'string') throw new SyntaxError('[SLASH-COMMAND-MANAGER] No token provided');
    this.id = id;
    this._token = token;
  }

  /**
   * Set command guild ID
   * @param {string} guildID
   * @returns {SlashCommandsManager}
   */
  public setGuildID(guildID: string): SlashCommandsManager {
    if (!guildID || typeof guildID !== 'string') throw new SyntaxError('[SLASH-COMMAND-MANAGER] No guild id provided');
    this.guildID = guildID;
    return this;
  }

  /**
   *
   * @param {SlashCommandBuilder} command
   * @param options
   * @returns {SlashCommandsManager}
   */
  public loadCommand(command: SlashCommandBuilder | object | any): SlashCommandsManager {
    if (!command || typeof command !== 'object') throw new SyntaxError('[SLASH-COMMAND-MANAGER] No command provided');
    this.loaded.set(command.name, command);
    return this;
  }

  /**
   * Load multiple slash commands
   * @param {SlashCommandBuilder[] | object[] | any[]} command
   * @returns {Promise<SlashCommandsManager>}
   */
  public async loadMultipleCommands(command: SlashCommandBuilder[] | object[] | any[]): Promise<SlashCommandsManager> {
    if (!command || typeof command !== 'object') throw new SyntaxError('[SLASH-COMMAND-MANAGER] No command provided');
    command.forEach((slashCmd: any) => {
      this.loaded.set(slashCmd.name, slashCmd);
    });
    return this;
  }

  /**
   * Push loaded slash command (all or specific)
   * @param {PushLoadedOptions} options
   * @returns {Promise<SlashCommandsManager>}
   */
  public async pushLoaded(options?: PushLoadedOptions): Promise<SlashCommandsManager> {
    if (this.guildID === undefined)
      options && options.guildID && typeof options.guildID === 'string'
        ? (this.guildID = options.guildID)
        : (this.guildID = undefined);
    if (options?.all === true) {
      this.loaded.forEach(async (slashCmd: any) => {
        this.pushCommand(
          slashCmd instanceof SlashCommandBuilder ? JSON.stringify(slashCmd.getJSON()) : JSON.stringify(slashCmd),
          {
            guildID: this.guildID !== undefined ? this.guildID : undefined,
          },
        );
      });
    } else if (options?.commandName && typeof options.commandName === 'string') {
      const slashCmd = this.loaded.get(options.commandName);
      if (!slashCmd) console.error('[SLASH-COMMAND-MANAGER] No command found for ' + options.commandName);
      this.pushCommand(
        slashCmd instanceof SlashCommandBuilder ? JSON.stringify(slashCmd.getJSON()) : JSON.stringify(slashCmd),
        {
          guildID: this.guildID !== undefined ? this.guildID : undefined,
        },
      );
    } else {
      this.loaded.forEach(async (slashCmd: any) => {
        this.pushCommand(
          slashCmd instanceof SlashCommandBuilder ? JSON.stringify(slashCmd.getJSON()) : JSON.stringify(slashCmd),
          {
            guildID: this.guildID !== undefined ? this.guildID : undefined,
          },
        );
      });
    }
    return this;
  }

  /**
   * Create a new slash command
   * @param {SlashCommandBuilder|object|any} command
   * @param {SlashCommandOptionsManager} options
   * @returns {Promise<SlashCommand>}
   */
  public async pushCommand(
    command: SlashCommandBuilder | object | any,
    options?: SlashCommandOptionsManager,
  ): Promise<SlashCommand> {
    if (!command || typeof command !== 'object') throw new SyntaxError('[SLASH-COMMAND-MANAGER] No command provided');
    if (
      !command.name ||
      typeof command.name !== 'string' ||
      !command.description ||
      typeof command.description !== 'string'
    )
      throw new SyntaxError('[SLASH-COMMAND-MANAGER] Invalid command content');
    if (this.guildID === undefined)
      options && options.guildID && typeof options.guildID === 'string'
        ? (this.guildID = options.guildID)
        : (this.guildID = undefined);
    const res = await RestManager.prototype.request(
      `${DISCORD_API}applications/${this.id}/${this.guildID !== undefined ? `guilds/${this.guildID}/` : ''}commands`,
      {
        token: this._token,
        method: 'POST',
        data: command instanceof SlashCommandBuilder ? JSON.stringify(command.getJSON()) : JSON.stringify(command),
      },
    );
    return new SlashCommand(await res);
  }

  /**
   * Edit an existing slash command
   * @param {SlashCommandBuilder|object|any} command
   * @param {SlashCommandOptionsWithId} options
   * @returns {Promise<SlashCommand>}
   */
  public async editCommand(
    command: SlashCommandBuilder | object | any,
    options: SlashCommandOptionsWithId,
  ): Promise<SlashCommand> {
    if (!command || typeof command !== 'object') throw new SyntaxError('[SLASH-COMMAND-MANAGER] No command provided');
    if (!options.commandID || typeof options.commandID !== 'string')
      throw new SyntaxError('[SLASH-COMMAND-MANAGER] No command id provided');
    if (this.guildID === undefined)
      options && options.guildID && typeof options.guildID === 'string'
        ? (this.guildID = options.guildID)
        : (this.guildID = undefined);
    const res = await RestManager.prototype.request(
      `${DISCORD_API}applications/${this.id}/${this.guildID !== undefined ? `guilds/${this.guildID}/` : ''}commands/${
        options.commandID
      }`,
      {
        token: this._token,
        method: 'PATCH',
        data: command instanceof SlashCommandBuilder ? JSON.stringify(command.getJSON()) : JSON.stringify(command),
      },
    );
    return new SlashCommand(await res);
  }
}
