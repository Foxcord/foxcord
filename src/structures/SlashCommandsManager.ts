import { DISCORD_API } from '../utils/Constants';
import { RestManager } from '../rest/RestManager';
import { SlashCommand } from './SlashCommand';
import { SlashCommandBuilder } from './SlashCommandBuilder';

interface SlashCommandOptions {
  /**
   * The guild ID
   */
  guildID?: string;
}

interface SlashCommandOptionsWithId extends SlashCommandOptions {
  /**
   * The command ID
   */
  commandID: string;
}

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

  /**
   * Create a new SlashCommandsManager
   * @param {string} id
   * @param {string} token
   */
  constructor(id: string, token: string) {
    if (!id || typeof id !== 'string') throw new SyntaxError('NO_ID_PROVIDED_OR_INVALID_ID');
    if (!token || typeof token !== 'string') throw new SyntaxError('NO_TOKEN_PROVIDED_OR_INVALID_TOKEN');
    this.id = id;
    this._token = token;
  }

  /**
   * Create a new slash command
   * @param {SlashCommandDefault} options
   * @param {string} guildID
   * @returns {Promise<SlashCommand>}
   */
  public async pushCommand(command: SlashCommandBuilder, options?: SlashCommandOptions): Promise<SlashCommand> {
    if (!command || typeof command !== 'object') throw new SyntaxError('NO_COMMAND_PROVIDED_OR_INVALID_COMMAND');
    if (
      !command.name ||
      typeof command.name !== 'string' ||
      !command.description ||
      typeof command.description !== 'string'
    )
      throw new SyntaxError('INVALID_COMMAND_CONTENT');
    const res = await RestManager.prototype.REQUEST(
      `${DISCORD_API}applications/${this.id}/${
        options && options.guildID && typeof options.guildID === 'string' ? `guilds/${options.guildID}/` : ''
      }commands`,
      {
        token: this._token,
        data: JSON.stringify(command.getJSON()),
      },
    );
    return new SlashCommand(await res);
  }

  /**
   * Edit an existing slash command
   * @param {SlashCommandBuilder} command
   * @param {SlashCommandOptionsWithId} options
   * @returns {Promise<SlashCommand>}
   */
  public async editCommand(command: SlashCommandBuilder, options: SlashCommandOptionsWithId): Promise<SlashCommand> {
    if (!command || typeof command !== 'object') throw new SyntaxError('NO_COMMAND_PROVIDED_OR_INVALID_COMMAND');
    if (!options.commandID || typeof options.commandID !== 'string')
      throw new SyntaxError('NO_COMMAND_ID_PROVIDED_OR_INVALID_COMMAND_ID');
    const res = await RestManager.prototype.REQUEST(
      `${DISCORD_API}applications/${this.id}/${
        options.guildID && typeof options.guildID === 'string' ? `guilds/${options.guildID}/` : ''
      }commands/${options.commandID}`,
      {
        token: this._token,
        data: JSON.stringify(command.getJSON()),
        method: 'PATCH',
      },
    );
    return new SlashCommand(await res);
  }
}
